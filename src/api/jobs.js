import supabaseClient from "@/utils/supabase";

// Fetch Jobs
export async function getJobs(token, { location, company_id, searchQuery }) {
  const supabase = await supabaseClient(token);
  let query = supabase.from("jobs").select(`
      *,
      saved:saved_jobs!saved_jobs_job_id_fkey(id),
      company:companies(name,logo_url)
    `);
  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}

// Read Saved Jobs
export async function getSavedJobs(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*, job: jobs(*, company: companies(name,logo_url))");

  if (error) {
    console.error("Error fetching Saved Jobs:", error);
    return null;
  }

  return data;
}

// Read single job
export async function getSingleJob(token, { job_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .select("*, company:companies(*), applications!applications_job_id_fkey(*)")
    .eq("id", job_id)
    .single();

  if (error) {
    console.error("Error fetching job:", error);
    throw error;
  }

  return data;
}

// - Add / Remove Saved Job
export async function saveJob(token, { alreadySaved, savedId }, saveData) {
  const supabase = await supabaseClient(token);

  if (alreadySaved) {
    // Verify the record exists before deletion
    const { data: existing } = await supabase
      .from("saved_jobs")
      .select("id")
      .eq("id", savedId)
      .single();

    if (!existing) {
      throw new Error("Saved job not found");
    }

    const { error } = await supabase.from("saved_jobs").delete().match({
      id: savedId,
      user_id: saveData.user_id,
    });

    if (error) throw error;
    return { action: "deleted", id: savedId };
  } else {
    // Check if already exists to prevent duplicates
    const { data: existing } = await supabase
      .from("saved_jobs")
      .select("id")
      .match({
        job_id: saveData.job_id,
        user_id: saveData.user_id,
      })
      .maybeSingle();

    if (existing) {
      return { action: "already_exists", id: existing.id };
    }

    const { data, error } = await supabase
      .from("saved_jobs")
      .insert(saveData)
      .select("*")
      .single();

    if (error) throw error;
    return { action: "created", data };
  }
}

// - job isOpen toggle - (recruiter_id = auth.uid())
export async function updateHiringStatus(token, { job_id }, isOpen) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error Updating Hiring Status:", error);
    return null;
  }

  return data;
}

// get my created jobs
export async function getMyJobs(token, { recruiter_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select("*, company: companies(name,logo_url)")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}

// Delete job
export async function deleteJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error: deleteError } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (deleteError) {
    console.error("Error deleting job:", deleteError);
    return data;
  }

  return data;
}

// - post job
export async function addNewJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error Creating Job");
  }

  return data;
}
