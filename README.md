# Personal Accounting App

A modern, cyberpunk-themed personal accounting application built with React, TypeScript, and Supabase.

![Personal Accounting App](https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200&h=400)

## Features

- 🔐 Secure user authentication
- 💰 Track income and expenses
- 📊 Beautiful data visualization
- 🌐 Multi-currency support
- 📱 Responsive design
- 🎨 Cyberpunk theme with light/dark mode
- 🔄 Real-time updates with Supabase
- 📁 Custom categories management
- 💳 Payment methods management

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Supabase
- Chart.js
- Lucide Icons

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/personal-accounting-app.git
   ```

2. Install dependencies:
   ```bash
   cd personal-accounting-app
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Database Setup

The application uses Supabase as its backend. The database schema includes:

- User authentication
- Transactions table
- Categories management
- Payment methods
- Exchange rates

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.