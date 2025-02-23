
import { supabase } from './supabase';

async function testDatabaseConnections() {
  console.log('Starting database connection tests...');

  try {
    // Test 1: Basic Connection Test
    console.log('\nBasic Connection Test:');
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count(*)');

    if (testError) {
      console.error('❌ Basic connection failed:', testError.message);
      console.error('Error details:', JSON.stringify(testError, null, 2));
    } else {
      console.log('✅ Basic connection successful');
      console.log('Connection data:', JSON.stringify(testData, null, 2));
    }

    // Test 2: Profiles Table Test
    console.log('\nProfiles Table Test:');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, role')
      .limit(1);
    
    if (profileError) {
      console.error('❌ Profiles query failed:', profileError.message);
      console.error('Error details:', JSON.stringify(profileError, null, 2));
    } else {
      console.log('✅ Profiles table accessible');
      console.log('Sample data:', JSON.stringify(profileData, null, 2));
    }

    // Test 3: Companies Table Test
    console.log('\nCompanies Table Test:');
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('id, name')
      .limit(1);

    if (companyError) {
      console.error('❌ Companies query failed:', companyError.message);
      console.error('Error details:', JSON.stringify(companyError, null, 2));
    } else {
      console.log('✅ Companies table accessible');
      console.log('Sample data:', JSON.stringify(companyData, null, 2));
    }

  } catch (err) {
    console.error('❌ Unexpected error during database tests:', err);
    console.error('Full error:', JSON.stringify(err, null, 2));
  }
}

// Actually call the function
testDatabaseConnections();
