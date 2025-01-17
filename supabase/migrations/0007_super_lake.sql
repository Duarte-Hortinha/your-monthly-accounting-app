/*
  # Seed December 2024 transactions

  1. Purpose
    - Add realistic transactions for December 2024
    - Simulate expenses for a person living in Lisbon
    - Include typical costs for rent, utilities, transportation, and daily expenses

  2. Transaction Categories
    - Housing (rent, utilities)
    - Transportation (motorbike expenses, fuel)
    - Food (groceries, meals out)
    - Health & Fitness (gym membership)
    - Entertainment (occasional outings)
    - Office-related expenses
*/

-- Function to insert transactions for a specific user
CREATE OR REPLACE FUNCTION insert_december_2024_transactions(user_uuid UUID)
RETURNS void AS $$
BEGIN
  -- Housing & Utilities
  INSERT INTO transactions (
    user_id, amount, type, payment_method, description, accounting_type,
    category, transaction_date, has_receipt
  ) VALUES
    (user_uuid, -850, 'expense', 'Santander/MB Way', 'Monthly rent payment - T1 Arroios', 'external', 'Housing', '2024-12-01', true),
    (user_uuid, -45, 'expense', 'Santander/MB Way', 'Water bill - EPAL', 'external', 'Utilities', '2024-12-05', true),
    (user_uuid, -65, 'expense', 'Santander/MB Way', 'Electricity bill - EDP', 'external', 'Utilities', '2024-12-05', true),
    (user_uuid, -35, 'expense', 'Santander/MB Way', 'Internet - MEO Fibra', 'external', 'Utilities', '2024-12-03', true);

  -- Transportation
  INSERT INTO transactions (
    user_id, amount, type, payment_method, description, accounting_type,
    category, transaction_date, has_receipt
  ) VALUES
    (user_uuid, -45, 'expense', 'Revolut', 'Motorbike fuel - Galp Entrecampos', 'external', 'Transportation', '2024-12-02', true),
    (user_uuid, -40, 'expense', 'Revolut', 'Motorbike fuel - Repsol Saldanha', 'external', 'Transportation', '2024-12-16', true),
    (user_uuid, -120, 'expense', 'Santander/MB Way', 'Motorbike insurance monthly payment', 'external', 'Transportation', '2024-12-01', true),
    (user_uuid, -35, 'expense', 'Revolut', 'Motorbike maintenance - oil check', 'external', 'Transportation', '2024-12-10', true);

  -- Food & Groceries
  INSERT INTO transactions (
    user_id, amount, type, payment_method, description, accounting_type,
    category, transaction_date, has_receipt
  ) VALUES
    (user_uuid, -85, 'expense', 'Santander/MB Way', 'Grocery shopping - Pingo Doce Arroios', 'internal', 'Grocery Shopping', '2024-12-01', true),
    (user_uuid, -65, 'expense', 'Santander/MB Way', 'Grocery shopping - Continente Saldanha', 'internal', 'Grocery Shopping', '2024-12-08', true),
    (user_uuid, -75, 'expense', 'Santander/MB Way', 'Grocery shopping - Pingo Doce Arroios', 'internal', 'Grocery Shopping', '2024-12-15', true),
    (user_uuid, -70, 'expense', 'Santander/MB Way', 'Grocery shopping - Continente Saldanha', 'internal', 'Grocery Shopping', '2024-12-22', true);

  -- Office Meals
  INSERT INTO transactions (
    user_id, amount, type, payment_method, description, accounting_type,
    category, transaction_date, has_receipt
  ) VALUES
    (user_uuid, -8.5, 'expense', 'Revolut', 'Lunch at office cafeteria', 'internal', 'Meals Out', '2024-12-02', true),
    (user_uuid, -9.5, 'expense', 'Revolut', 'Lunch at Vitaminas', 'internal', 'Meals Out', '2024-12-04', true),
    (user_uuid, -8.5, 'expense', 'Revolut', 'Lunch at office cafeteria', 'internal', 'Meals Out', '2024-12-06', true),
    (user_uuid, -10.5, 'expense', 'Revolut', 'Lunch at Padaria Portuguesa', 'internal', 'Meals Out', '2024-12-09', true),
    (user_uuid, -8.5, 'expense', 'Revolut', 'Lunch at office cafeteria', 'internal', 'Meals Out', '2024-12-11', true),
    (user_uuid, -9.0, 'expense', 'Revolut', 'Lunch at Vitaminas', 'internal', 'Meals Out', '2024-12-13', true),
    (user_uuid, -8.5, 'expense', 'Revolut', 'Lunch at office cafeteria', 'internal', 'Meals Out', '2024-12-16', true),
    (user_uuid, -9.5, 'expense', 'Revolut', 'Lunch at Padaria Portuguesa', 'internal', 'Meals Out', '2024-12-18', true),
    (user_uuid, -8.5, 'expense', 'Revolut', 'Lunch at office cafeteria', 'internal', 'Meals Out', '2024-12-20', true);

  -- Health & Fitness
  INSERT INTO transactions (
    user_id, amount, type, payment_method, description, accounting_type,
    category, transaction_date, has_receipt
  ) VALUES
    (user_uuid, -45, 'expense', 'Santander/MB Way', 'Fitness Hut Saldanha - Monthly membership', 'internal', 'Healthcare', '2024-12-01', true);

  -- Entertainment
  INSERT INTO transactions (
    user_id, amount, type, payment_method, description, accounting_type,
    category, transaction_date, has_receipt
  ) VALUES
    (user_uuid, -35, 'expense', 'Revolut', 'Cinema at El Corte Inglés with friends', 'internal', 'Entertainment', '2024-12-08', true),
    (user_uuid, -45, 'expense', 'Revolut', 'Dinner at Time Out Market', 'internal', 'Meals Out', '2024-12-08', true),
    (user_uuid, -30, 'expense', 'Revolut', 'Drinks at Park Bar', 'internal', 'Entertainment', '2024-12-15', true);

  -- Office Supplies
  INSERT INTO transactions (
    user_id, amount, type, payment_method, description, accounting_type,
    category, transaction_date, has_receipt
  ) VALUES
    (user_uuid, -15, 'expense', 'Revolut', 'Notebook and pens - Staples', 'internal', 'Office Costs', '2024-12-04', true);

  -- Income
  INSERT INTO transactions (
    user_id, amount, type, payment_method, description, accounting_type,
    category, transaction_date, has_receipt
  ) VALUES
    (user_uuid, 2200, 'revenue', 'Santander/MB Way', 'December Salary', 'external', 'Income', '2024-12-28', true);
END;
$$ LANGUAGE plpgsql;

-- Function to help users add sample data
CREATE OR REPLACE FUNCTION add_sample_december_data()
RETURNS void AS $$
BEGIN
  -- Get the current user's ID
  PERFORM insert_december_2024_transactions(auth.uid());
END;
$$ LANGUAGE plpgsql;