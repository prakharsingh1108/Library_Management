import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiArrowRight, FiBookOpen, FiSearch, FiShield, FiUsers } from 'react-icons/fi';
import { fetchBooks } from '../../redux/bookSlice';
import BookCard from '../../components/BookCard';
import { BookCardSkeleton } from '../../components/Loader/Skeleton';
import { APP_NAME } from '../../utils/constants';

const features = [
  {
    icon: FiSearch,
    title: 'Smart Search',
    description: 'Find books instantly by title, author, or genre with powerful filters.',
  },
  {
    icon: FiBookOpen,
    title: 'Easy Borrowing',
    description: 'Borrow books online and track due dates from your personal dashboard.',
  },
  {
    icon: FiShield,
    title: 'Secure Access',
    description: 'Your account is protected with OTP verification and secure sessions.',
  },
  {
    icon: FiUsers,
    title: 'Community',
    description: 'Join thousands of readers discovering their next favorite book.',
  },
];

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Graduate Student',
    quote: 'The easiest library system I have ever used. Borrowing and returning books is seamless.',
  },
  {
    name: 'James Chen',
    role: 'Faculty Member',
    quote: 'As an admin, managing inventory and tracking borrows has never been this efficient.',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Avid Reader',
    quote: 'Beautiful interface and great book catalog. I love the due date reminders!',
  },
];

const Home = () => {
  const dispatch = useDispatch();
  const { books, loading } = useSelector((state) => state.books);
  const featuredBooks = books.slice(0, 6);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  return (
    <div>
      {/* Hero */}
      <section className="page-container py-16 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-4 inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              Welcome to the future of libraries
            </span>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
              Discover, Borrow &{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Explore
              </span>{' '}
              Books
            </h1>
            <p className="mb-8 max-w-lg text-lg text-slate-600 dark:text-slate-400">
              {APP_NAME} brings your library online with a beautiful, modern experience.
              Browse thousands of titles and manage your reading journey effortlessly.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/books" className="btn-primary">
                Browse Books <FiArrowRight />
              </Link>
              <Link to="/register" className="btn-secondary">
                Get Started Free
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-card aspect-square max-w-md mx-auto flex items-center justify-center p-8">
              <FiBookOpen className="text-[8rem] text-indigo-400/40" />
            </div>
            <div className="absolute -bottom-4 -left-4 glass-card px-4 py-3">
              <p className="text-2xl font-bold text-indigo-600">{books.length || '500+'}+</p>
              <p className="text-xs text-slate-500">Books Available</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="bg-white/30 py-16 dark:bg-slate-900/30">
        <div className="page-container">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Featured Books</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Handpicked titles from our collection
              </p>
            </div>
            <Link to="/books" className="hidden text-sm font-semibold text-indigo-600 sm:inline-flex sm:items-center sm:gap-1">
              View all <FiArrowRight />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <BookCardSkeleton key={i} />)
              : featuredBooks.length > 0
                ? featuredBooks.map((book) => <BookCard key={book._id} book={book} />)
                : (
                  <p className="col-span-full text-center text-slate-500">
                    No books available yet. Check back soon!
                  </p>
                )}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="page-container py-16">
        <div className="glass-card grid gap-8 p-8 lg:grid-cols-2 lg:p-12">
          <div>
            <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
              About Our Library
            </h2>
            <p className="mb-4 leading-relaxed text-slate-600 dark:text-slate-400">
              {APP_NAME} is a comprehensive digital library platform designed to make reading
              accessible to everyone. Our mission is to connect readers with knowledge through
              technology.
            </p>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              From classic literature to cutting-edge research, our curated collection spans
              every genre. With smart borrowing, automatic fine calculation, and an intuitive
              admin dashboard, we handle the logistics so you can focus on reading.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-slate-200/50 bg-white/50 p-4 dark:border-slate-700/50 dark:bg-slate-800/50"
              >
                <feature.icon className="mb-2 text-2xl text-indigo-600" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">{feature.title}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="page-container py-16">
        <h2 className="mb-10 text-center text-3xl font-bold text-slate-900 dark:text-white">
          What Readers Say
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6"
            >
              <p className="mb-4 italic text-slate-600 dark:text-slate-400">&ldquo;{t.quote}&rdquo;</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{t.name}</p>
              <p className="text-sm text-indigo-500">{t.role}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
