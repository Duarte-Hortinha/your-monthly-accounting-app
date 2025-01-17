/*
  # Sample Transaction Data 2023-2024

  1. Overview
    - Adds realistic transaction data for a young professional in Lisbon
    - Covers late 2023 and full 2024
    - Includes multiple income sources and regular expenses
*/

CREATE OR REPLACE FUNCTION generate_sample_data_2023_2024(user_uuid UUID)
RETURNS void AS $$
DECLARE
  curr_date DATE;
  month_counter INT;
BEGIN
  FOR month_counter IN 0..15 LOOP
    SELECT DATE '2023-09-01' + (month_counter * INTERVAL '1 month') INTO curr_date;
    
    -- Regular Monthly Income
    INSERT INTO transactions (
      user_id, amount, type, payment_method, description, accounting_type,
      category, transaction_date, has_receipt
    ) VALUES
      -- Primary Income
      (user_uuid, 2200, 'revenue', 'Santander/MB Way', 'Monthly Salary', 'external', 'Income', 
       curr_date + INTERVAL '28 days', true),
      -- Real Estate Income
      (user_uuid, 850, 'revenue', 'Santander/MB Way', 'Apartment Rental Income', 'external', 'Income',
       curr_date + INTERVAL '5 days', true),
      (user_uuid, 150, 'revenue', 'Santander/MB Way', 'Garage Spot Rental', 'external', 'Income',
       curr_date + INTERVAL '3 days', true),
      (user_uuid, 400, 'revenue', 'Santander/MB Way', 'Rural House Rental', 'external', 'Income',
       curr_date + INTERVAL '7 days', true);

    -- Quarterly Investment Income
    IF EXTRACT(MONTH FROM curr_date) IN (3, 6, 9, 12) THEN
      INSERT INTO transactions (
        user_id, amount, type, payment_method, description, accounting_type,
        category, transaction_date, has_receipt
      ) VALUES
        (user_uuid, 275, 'revenue', 'Santander/MB Way', 'Quarterly Dividend Income', 'external', 'Income',
         curr_date + INTERVAL '15 days', true);
    END IF;

    -- Annual Treasury Bond Interest
    IF EXTRACT(MONTH FROM curr_date) = 12 THEN
      INSERT INTO transactions (
        user_id, amount, type, payment_method, description, accounting_type,
        category, transaction_date, has_receipt
      ) VALUES
        (user_uuid, 350, 'revenue', 'Santander/MB Way', 'Treasury Bonds Annual Interest', 'external', 'Income',
         curr_date + INTERVAL '20 days', true);
    END IF;

    -- Regular Monthly Expenses
    INSERT INTO transactions (
      user_id, amount, type, payment_method, description, accounting_type,
      category, transaction_date, has_receipt
    ) VALUES
      -- Housing & Utilities
      (user_uuid, -850, 'expense', 'Santander/MB Way', 'Monthly Rent', 'external', 'Housing',
       curr_date + INTERVAL '1 day', true),
      (user_uuid, -45, 'expense', 'Santander/MB Way', 'Water Bill', 'external', 'Utilities',
       curr_date + INTERVAL '5 days', true),
      (user_uuid, -65, 'expense', 'Santander/MB Way', 'Electricity Bill', 'external', 'Utilities',
       curr_date + INTERVAL '5 days', true),
      (user_uuid, -35, 'expense', 'Santander/MB Way', 'Internet Bill', 'external', 'Utilities',
       curr_date + INTERVAL '3 days', true),

      -- Professional Space & Services
      (user_uuid, -200, 'expense', 'Santander/MB Way', 'Office Space Rental', 'internal', 'Office Costs',
       curr_date + INTERVAL '1 day', true),
      (user_uuid, -20, 'expense', 'Revolut', 'ChatGPT Subscription', 'internal', 'Office Costs',
       curr_date + INTERVAL '15 days', true),
      (user_uuid, -15, 'expense', 'Revolut', 'Bolt.new Subscription', 'internal', 'Office Costs',
       curr_date + INTERVAL '15 days', true),
      (user_uuid, -29, 'expense', 'Revolut', 'MailChimp Basic Plan', 'internal', 'Office Costs',
       curr_date + INTERVAL '15 days', true),
      (user_uuid, -39, 'expense', 'Revolut', 'SocialBee Subscription', 'internal', 'Office Costs',
       curr_date + INTERVAL '15 days', true),

      -- Regular Services
      (user_uuid, -75, 'expense', 'Revolut', 'Laundry & Cleaning Service', 'external', 'Professional Services',
       curr_date + INTERVAL '10 days', true),
      (user_uuid, -300, 'expense', 'Revolut', 'Weekly Meal Prep Service', 'external', 'Meals Out',
       curr_date + INTERVAL '7 days', true),

      -- Transportation
      (user_uuid, -25, 'expense', 'Revolut', 'Motorbike Insurance Monthly', 'external', 'Transportation',
       curr_date + INTERVAL '1 day', true),
      (user_uuid, -45, 'expense', 'Revolut', 'Motorbike Fuel', 'external', 'Transportation',
       curr_date + INTERVAL '15 days', true),

      -- Health & Fitness
      (user_uuid, -45, 'expense', 'Santander/MB Way', 'Gym Membership', 'internal', 'Healthcare',
       curr_date + INTERVAL '1 day', true);

    -- Entertainment & Social
    INSERT INTO transactions (
      user_id, amount, type, payment_method, description, accounting_type,
      category, transaction_date, has_receipt
    ) VALUES
      (user_uuid, -35, 'expense', 'Revolut', 'Dinner with Friends', 'internal', 'Entertainment',
       curr_date + INTERVAL '8 days', true),
      (user_uuid, -25, 'expense', 'Revolut', 'Pool Night', 'internal', 'Entertainment',
       curr_date + INTERVAL '15 days', true),
      (user_uuid, -40, 'expense', 'Revolut', 'Weekend Social Activities', 'internal', 'Entertainment',
       curr_date + INTERVAL '22 days', true);

    -- Bi-monthly Groceries
    INSERT INTO transactions (
      user_id, amount, type, payment_method, description, accounting_type,
      category, transaction_date, has_receipt
    ) VALUES
      (user_uuid, -85, 'expense', 'Santander/MB Way', 'Bi-weekly Groceries - Pingo Doce', 'external', 'Grocery Shopping',
       curr_date + INTERVAL '1 day', true),
      (user_uuid, -75, 'expense', 'Santander/MB Way', 'Bi-weekly Groceries - Continente', 'external', 'Grocery Shopping',
       curr_date + INTERVAL '15 days', true);

    -- Quarterly Motorbike Maintenance
    IF EXTRACT(MONTH FROM curr_date) IN (3, 6, 9, 12) THEN
      INSERT INTO transactions (
        user_id, amount, type, payment_method, description, accounting_type,
        category, transaction_date, has_receipt
      ) VALUES
        (user_uuid, -50, 'expense', 'Revolut', 'Quarterly Motorbike Maintenance', 'external', 'Transportation',
         curr_date + INTERVAL '10 days', true);
    END IF;

    -- Semi-annual Healthcare
    IF EXTRACT(MONTH FROM curr_date) IN (6, 12) THEN
      INSERT INTO transactions (
        user_id, amount, type, payment_method, description, accounting_type,
        category, transaction_date, has_receipt
      ) VALUES
        (user_uuid, -80, 'expense', 'Santander/MB Way', 'Dental Hygiene Visit', 'external', 'Healthcare',
         curr_date + INTERVAL '12 days', true);
    END IF;

    -- Random Medical Consultations
    IF EXTRACT(MONTH FROM curr_date) IN (3, 7, 11) THEN
      INSERT INTO transactions (
        user_id, amount, type, payment_method, description, accounting_type,
        category, transaction_date, has_receipt
      ) VALUES
        (user_uuid, -25, 'expense', 'Santander/MB Way', 'Medical Consultation', 'external', 'Healthcare',
         curr_date + INTERVAL '18 days', true);
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to add sample data for the current user
CREATE OR REPLACE FUNCTION add_sample_data_2023_2024()
RETURNS void AS $$
BEGIN
  PERFORM generate_sample_data_2023_2024(auth.uid());
END;
$$ LANGUAGE plpgsql;