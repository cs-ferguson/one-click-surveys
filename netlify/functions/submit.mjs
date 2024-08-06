import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_PROJECT_URL
const supabaseKey = process.env.SUPABASE_API_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function insertSurveySubmission(params) {

  try {
    let { data: survey_submissions, error } = await supabase
      .from('survey_submissions')
      .insert([
        { score: params.score, submitter: params.submitter, source: params.source, campaign_id: params.campaignId },
      ])
      .select()

    if (error) {
      throw error; // Or handle the error differently
    }

    return survey_submissions;  // Return the entire data array
  } catch (error) {
    return { error: error.message }; // Return an error message
  }
  
}

async function checkCampaign ( campaignId ) {

  try {
    let { data: campaign, error } = await supabase
      .from('campaign')
      .select('id')
      .eq('id', campaignId)

    if (error) {
      throw error; // Or handle the error differently
    }

    return campaign;  // Return the entire data array

  } catch (error) {
    return { error: error.message }; // Return an error message
  }
}

export default async (req, context) => {

  let responseBody = null;
  let responseOk = null;
  let responseStatus = null;

  const score = new URL(req.url).searchParams.get('score') || null
  const submitter = new URL(req.url).searchParams.get('submitter') || null
  const source = new URL(req.url).searchParams.get('source') || null
  const campaignId = new URL(req.url).searchParams.get('campaign') || null

  //check campaign before proceed
  const campaignResponse = await checkCampaign( campaignId );
  responseBody = JSON.stringify(campaignResponse);
  responseStatus = 200;
  responseOk = true;

  if (campaignResponse.length !== 1){
    responseBody = JSON.stringify({ error: "Campaign check failed." });
    responseStatus = 500;
    responseOk = false;
    return new Response(responseBody, {status: responseStatus, ok: responseOk} );
  }

  //check required fields available and insert
  if (score && submitter && source && campaignId) {
    const submissionResponse = await insertSurveySubmission({score, submitter, source, campaignId});
    responseBody = JSON.stringify(submissionResponse);
    responseStatus = 200;
    responseOk = true;
  } else {
    responseBody = JSON.stringify({ error: "Required fields missing." });
    responseStatus = 500;
    responseOk = false;
  }
  
  return new Response(responseBody, {status: responseStatus, ok: responseOk} );

};