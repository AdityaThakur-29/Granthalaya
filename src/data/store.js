// Centralized localStorage abstraction + Indian seed data
// ALL localStorage access goes through this module.
// No raw localStorage calls anywhere else in the codebase.

const STORAGE_KEYS = {
  books: 'library_books',
  members: 'library_members',
  transactions: 'library_transactions',
  reservations: 'library_reservations',
  role: 'library_role',
  initialized: 'library_initialized',
};

// ---------------------
// Generic helpers
// ---------------------
function read(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ---------------------
// Books
// ---------------------
export function getBooks() {
  return read(STORAGE_KEYS.books);
}

export function getBookById(id) {
  return getBooks().find((b) => b.id === id) || null;
}

export function addBook(book) {
  const books = getBooks();
  const newBook = {
    ...book,
    id: generateId('book'),
    availableCopies: book.totalCopies,
    addedAt: new Date().toISOString(),
  };
  books.push(newBook);
  write(STORAGE_KEYS.books, books);
  return newBook;
}

export function updateBook(id, updates) {
  const books = getBooks().map((b) => (b.id === id ? { ...b, ...updates } : b));
  write(STORAGE_KEYS.books, books);
}

export function deleteBook(id) {
  const books = getBooks().filter((b) => b.id !== id);
  write(STORAGE_KEYS.books, books);
}

// ---------------------
// Members
// ---------------------
export function getMembers() {
  return read(STORAGE_KEYS.members);
}

export function getMemberById(id) {
  return getMembers().find((m) => m.id === id) || null;
}

export function addMember(member) {
  const members = getMembers();
  const newMember = {
    ...member,
    id: generateId('mem'),
    memberSince: new Date().toISOString(),
    status: 'active',
  };
  members.push(newMember);
  write(STORAGE_KEYS.members, members);
  return newMember;
}

export function updateMember(id, updates) {
  const members = getMembers().map((m) =>
    m.id === id ? { ...m, ...updates } : m
  );
  write(STORAGE_KEYS.members, members);
}

// ---------------------
// Transactions
// ---------------------
export function getTransactions() {
  return read(STORAGE_KEYS.transactions);
}

export function getActiveTransactions() {
  return getTransactions().filter((t) => t.status === 'active');
}

export function issueBook(bookId, memberId) {
  const book = getBookById(bookId);
  if (!book || book.availableCopies <= 0) return null;

  // Decrement available copies
  updateBook(bookId, { availableCopies: book.availableCopies - 1 });

  const txn = {
    id: generateId('txn'),
    bookId,
    memberId,
    type: 'issue',
    issuedAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
    returnedAt: null,
    status: 'active',
  };

  const transactions = getTransactions();
  transactions.push(txn);
  write(STORAGE_KEYS.transactions, transactions);
  return txn;
}

export function returnBook(transactionId) {
  const transactions = getTransactions();
  const txn = transactions.find((t) => t.id === transactionId);
  if (!txn || txn.status !== 'active') return false;

  // Increment available copies
  const book = getBookById(txn.bookId);
  if (book) {
    updateBook(txn.bookId, { availableCopies: book.availableCopies + 1 });
  }

  const updated = transactions.map((t) =>
    t.id === transactionId
      ? { ...t, status: 'returned', returnedAt: new Date().toISOString() }
      : t
  );
  write(STORAGE_KEYS.transactions, updated);
  return true;
}

export function renewBook(transactionId) {
  const transactions = getTransactions();
  const txn = transactions.find((t) => t.id === transactionId);
  if (!txn || txn.status !== 'active') return false;

  const newDueDate = new Date(
    new Date(txn.dueDate).getTime() + 14 * 24 * 60 * 60 * 1000
  ).toISOString();

  const updated = transactions.map((t) =>
    t.id === transactionId ? { ...t, dueDate: newDueDate, type: 'renew' } : t
  );
  write(STORAGE_KEYS.transactions, updated);
  return true;
}

// ---------------------
// Reservations
// ---------------------
export function getReservations() {
  return read(STORAGE_KEYS.reservations);
}

export function createReservation({ bookId, memberId, visitorName, notes }) {
  const reservation = {
    id: generateId('res'),
    bookId,
    memberId: memberId || null,
    visitorName: visitorName || null,
    reservedAt: new Date().toISOString(),
    status: 'pending',
    notes: notes || '',
  };

  const reservations = getReservations();
  reservations.push(reservation);
  write(STORAGE_KEYS.reservations, reservations);
  return reservation;
}

export function updateReservation(id, updates) {
  const reservations = getReservations().map((r) =>
    r.id === id ? { ...r, ...updates } : r
  );
  write(STORAGE_KEYS.reservations, reservations);
}

// ---------------------
// Role management
// ---------------------
export function getRole() {
  return localStorage.getItem(STORAGE_KEYS.role) || 'user';
}

export function setRole(role) {
  localStorage.setItem(STORAGE_KEYS.role, role);
}

// ---------------------
// Seed data
// ---------------------
const COVER_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#F97316', '#6366F1', '#14B8A6',
  '#E11D48', '#7C3AED', '#0EA5E9', '#D946EF', '#84CC16',
];

const SEED_BOOKS = [
  { title: 'The Guide', author: 'R.K. Narayan', isbn: '978-0143039648', category: 'Fiction', totalCopies: 3 },
  { title: 'Malgudi Days', author: 'R.K. Narayan', isbn: '978-0143039655', category: 'Fiction', totalCopies: 2 },
  { title: 'Train to Pakistan', author: 'Khushwant Singh', isbn: '978-0143065883', category: 'Fiction', totalCopies: 2 },
  { title: 'The White Tiger', author: 'Aravind Adiga', isbn: '978-1416562603', category: 'Fiction', totalCopies: 3 },
  { title: 'A Suitable Boy', author: 'Vikram Seth', isbn: '978-0060786526', category: 'Fiction', totalCopies: 1 },
  { title: 'The God of Small Things', author: 'Arundhati Roy', isbn: '978-0812979657', category: 'Fiction', totalCopies: 2 },
  { title: 'Wings of Fire', author: 'A.P.J. Abdul Kalam', isbn: '978-8173711466', category: 'Biography', totalCopies: 4 },
  { title: 'Discovery of India', author: 'Jawaharlal Nehru', isbn: '978-0143031031', category: 'History', totalCopies: 2 },
  { title: 'Gitanjali', author: 'Rabindranath Tagore', isbn: '978-1420933444', category: 'Poetry', totalCopies: 3 },
  { title: 'The Immortals of Meluha', author: 'Amish Tripathi', isbn: '978-9380658742', category: 'Mythology', totalCopies: 5 },
  { title: 'Five Point Someone', author: 'Chetan Bhagat', isbn: '978-8129135476', category: 'Fiction', totalCopies: 4 },
  { title: 'Godan', author: 'Munshi Premchand', isbn: '978-8171676088', category: 'Classic', totalCopies: 2 },
  { title: 'My Experiments with Truth', author: 'Mahatma Gandhi', isbn: '978-0486245935', category: 'Biography', totalCopies: 3 },
  { title: 'The Algebra of Infinite Justice', author: 'Arundhati Roy', isbn: '978-0143029076', category: 'Non-Fiction', totalCopies: 1 },
  { title: 'Ignited Minds', author: 'A.P.J. Abdul Kalam', isbn: '978-0143029571', category: 'Non-Fiction', totalCopies: 3 },
];

const SEED_MEMBERS = [
  { name: 'Aarav Sharma', email: 'aarav.sharma@gmail.com', phone: '+91 98765 43210' },
  { name: 'Priya Patel', email: 'priya.patel@gmail.com', phone: '+91 87654 32109' },
  { name: 'Rohan Gupta', email: 'rohan.gupta@gmail.com', phone: '+91 76543 21098' },
  { name: 'Sneha Iyer', email: 'sneha.iyer@gmail.com', phone: '+91 65432 10987' },
  { name: 'Vikram Singh', email: 'vikram.singh@gmail.com', phone: '+91 94321 09876' },
];

export function initializeData() {
  if (localStorage.getItem(STORAGE_KEYS.initialized)) return;

  // Seed books
  const books = SEED_BOOKS.map((book, i) => ({
    ...book,
    id: `book_${String(i + 1).padStart(3, '0')}`,
    availableCopies: book.totalCopies,
    coverColor: COVER_COLORS[i % COVER_COLORS.length],
    addedAt: new Date(2026, 8, 1 + i).toISOString(), // Sept 2026 onwards
  }));
  write(STORAGE_KEYS.books, books);

  // Seed members
  const members = SEED_MEMBERS.map((member, i) => ({
    ...member,
    id: `mem_${String(i + 1).padStart(3, '0')}`,
    memberSince: new Date(2026, 7, 15 + i * 3).toISOString(), // Aug 2026 onwards
    status: 'active',
  }));
  write(STORAGE_KEYS.members, members);

  // Seed a few transactions
  const transactions = [
    {
      id: 'txn_001',
      bookId: 'book_001',
      memberId: 'mem_001',
      type: 'issue',
      issuedAt: new Date(2026, 9, 1).toISOString(),
      dueDate: new Date(2026, 9, 15).toISOString(),
      returnedAt: null,
      status: 'active',
    },
    {
      id: 'txn_002',
      bookId: 'book_007',
      memberId: 'mem_002',
      type: 'issue',
      issuedAt: new Date(2026, 8, 25).toISOString(),
      dueDate: new Date(2026, 9, 8).toISOString(),
      returnedAt: null,
      status: 'active',
    },
    {
      id: 'txn_003',
      bookId: 'book_011',
      memberId: 'mem_003',
      type: 'issue',
      issuedAt: new Date(2026, 8, 20).toISOString(),
      dueDate: new Date(2026, 9, 3).toISOString(),
      returnedAt: new Date(2026, 9, 1).toISOString(),
      status: 'returned',
    },
  ];

  // Update available copies for active transactions
  const updatedBooks = [...books];
  transactions.forEach((txn) => {
    if (txn.status === 'active') {
      const book = updatedBooks.find((b) => b.id === txn.bookId);
      if (book) book.availableCopies = Math.max(0, book.availableCopies - 1);
    }
  });
  write(STORAGE_KEYS.books, updatedBooks);
  write(STORAGE_KEYS.transactions, transactions);

  // Seed a reservation
  const reservations = [
    {
      id: 'res_001',
      bookId: 'book_004',
      memberId: 'mem_004',
      visitorName: null,
      reservedAt: new Date(2026, 9, 2, 9).toISOString(),
      status: 'pending',
      notes: '',
    },
  ];
  write(STORAGE_KEYS.reservations, reservations);

  // Set role
  localStorage.setItem(STORAGE_KEYS.role, 'user');
  localStorage.setItem(STORAGE_KEYS.initialized, 'true');
}

// ---------------------
// Reset (for development)
// ---------------------
export function resetData() {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  initializeData();
}
