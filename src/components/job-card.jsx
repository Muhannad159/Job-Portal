import { Heart, MapPinIcon, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Link } from "react-router-dom";
import { deleteJob, saveJob } from "@/api/jobs";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useState } from "react";
import { BarLoader } from "react-spinners";
import supabaseClient from "@/utils/supabase";

const JobCard = ({
  job,
  savedInit = false,
  onJobAction = () => {},
  isMyJob = false,
}) => {
  const [saved, setSaved] = useState(savedInit);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useUser();
  const { getToken } = useAuth();

  const handleSaveJob = async () => {
    setIsSaving(true);
    // Use savedInit as a fallback if job.saved is not available
    const currentSavedState = job.saved?.length > 0 || savedInit;
    const token = await getToken({ template: "supabase" });
    const savedId = job.saved?.[0]?.id;

    try {
      const result = await saveJob(
        token,
        {
          alreadySaved: currentSavedState,
          savedId,
        },
        {
          job_id: job.id,
          user_id: user.id,
        }
      );

      // Update state based on server response
      if (result.action === "deleted") {
        setSaved(false);
      } else if (
        result.action === "created" ||
        result.action === "already_exists"
      ) {
        setSaved(true);
      }

      // Trigger parent refresh
      onJobAction();

      // Optional verification
      if (process.env.NODE_ENV === "development") {
        const supabase = await supabaseClient(token);
        const { data } = await supabase
          .from("saved_jobs")
          .select("id")
          .eq("job_id", job.id)
          .eq("user_id", user.id);
        console.log("Verification:", data);
      }
    } catch (error) {
      console.error("Save error:", error);
      setSaved(currentSavedState); // Revert on error
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteJob = async () => {
    try {
      const token = await getToken({ template: "supabase" });
      await deleteJob(token, { job_id: job.id });
      onJobAction();
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex">
        <CardTitle className="flex justify-between font-bold">
          {job.title}
          {isMyJob && (
            <Trash2Icon
              fill="red"
              size={18}
              className="text-red-300 cursor-pointer"
              onClick={handleDeleteJob}
            />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex justify-between">
          {job.company && (
            <img
              src={job.company.logo_url}
              className="h-6"
              alt={job.company.name}
            />
          )}
          <div className="flex gap-2 items-center">
            <MapPinIcon size={15} /> {job.location}
          </div>
        </div>
        <hr />
        {job.description.substring(0, job.description.indexOf("."))}.
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link to={`/jobs/${job.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            More Details
          </Button>
        </Link>
        {!isMyJob && (
          <Button
            variant="outline"
            className="w-15"
            onClick={handleSaveJob}
            disabled={isSaving}
          >
            {saved ? (
              <Heart size={20} fill="red" stroke="red" />
            ) : (
              <Heart size={20} />
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
