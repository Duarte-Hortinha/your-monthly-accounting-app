/*
  # Initial Schema Setup for Personal Accounting App

  1. New Tables
    - `bank_accounts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `created_at` (timestamp)
    
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `amount` (decimal)
      - `type` (enum: 'expense', 'revenue')
      - `payment_method` (enum: 'cash', 'bank_account')
      - `bank_account_id` (uuid, references bank_accounts)
      - `has_receipt` (boolean)
      - `description` (text)
      - `accounting_type` (enum: 'internal', 'external')
      - `category` (text)
      - `transaction_date` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create enum types
CREATE TYPE transaction_type AS ENUM ('expense', 'revenue');
CREATE TYPE payment_method_type AS ENUM ('cash', 'bank_account');
CREATE TYPE accounting_type AS ENUM ('internal', 'external');

-- Create bank_accounts table
CREATE TABLE IF NOT EXISTS bank_accounts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    name text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    amount decimal NOT NULL,
    type transaction_type NOT NULL,
    payment_method payment_method_type NOT NULL,
    bank_account_id uuid REFERENCES bank_accounts,
    has_receipt boolean DEFAULT false,
    description text NOT NULL,
    accounting_type accounting_type NOT NULL,
    category text,
    transaction_date timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    CONSTRAINT valid_bank_account CHECK (
        (payment_method = 'bank_account' AND bank_account_id IS NOT NULL) OR
        (payment_method = 'cash' AND bank_account_id IS NULL)
    )
);

-- Enable Row Level Security
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for bank_accounts
CREATE POLICY "Users can manage their own bank accounts"
    ON bank_accounts
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);

-- Create policies for transactions
CREATE POLICY "Users can manage their own transactions"
    ON transactions
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);