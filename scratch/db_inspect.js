import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env.local manually
const envContent = fs.readFileSync(path.resolve('./.env.local'), 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim();
    env[key] = val;
  }
});

const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('id, title, category, pinned_hero, status')
      .eq('pinned_hero', true);

    if (error) throw error;

    console.log('--- PINNED HERO POSTS ---');
    console.log(posts);

    const { data: recent, error: recentErr } = await supabase
      .from('posts')
      .select('id, title, category, pinned_hero, status')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentErr) throw recentErr;

    console.log('\n--- 5 MOST RECENT POSTS ---');
    console.log(recent);
  } catch (err) {
    console.error('Error:', err);
  }
}

inspect();
