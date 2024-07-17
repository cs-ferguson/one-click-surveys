import { createClient } from '@supabase/supabase-js'

async function insertCesSubmission(params) {
  const supabaseUrl = process.env.SUPABASE_PROJECT_URL
  const supabaseKey = process.env.SUPABASE_API_KEY
  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    let { data: ces_submissions, error } = await supabase
      .from('ces_submissions')
      .insert([
        { score: params.score, submitter: params.submitter, survey_type: params.survey_type, source: 'test' },
      ])
      .select()

    if (error) {
      throw error; // Or handle the error differently
    }

    return ces_submissions;  // Return the entire data array
  } catch (error) {
    return { error: error.message }; // Return an error message
  }
}

export default async (req, context) => {

  let responseBody = null;

  const score = new URL(req.url).searchParams.get('score') || null
  const submitter = new URL(req.url).searchParams.get('submitter') || null
  const source = new URL(req.url).searchParams.get('source') || null
  const survey_type = new URL(req.url).searchParams.get('type') || null


  if (score && submitter && source && survey_type) {
    const submissionResponse = await insertCesSubmission({score, submitter, source, survey_type});
    responseBody = JSON.stringify(submissionResponse);
  } else {
    responseBody = JSON.stringify({ error: "Required fields missing." });
  }
  
  return new Response(responseBody);

};