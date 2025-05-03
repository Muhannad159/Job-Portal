import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { use, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const handleRoleSelect = async (role) => {
    await user
      .update({
        unsafeMetadata: { role },
      })
      .then(() => {
        navigate(role === "recruiter" ? "/post-job" : "/jobs");
      })
      .catch((error) => {
        console.error("Error updating user metadata:", error);
      });
  };
  useEffect(() => {
    if (user?.unsafeMetadata?.role) {
      navigate(
        user.unsafeMetadata.role === "recruiter" ? "/post-job" : "/jobs"
      );
    }
  }, [user]);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BeatLoader className="mb-4" width={"100%"} color="#36d7b7" />;
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center mt-30">
      <h2 className="gradient-title font-extrabold text-6xl sm:text-8xl tracking-tighter ">
        I am a...
      </h2>
      <div className="mt-16 grid grid-cols-2 gap-4 w-full md:px-40">
        <Button
          variant="blue"
          className="h-32 text-3xl"
          onClick={() => handleRoleSelect("candidate")}
        >
          Candidate
        </Button>
        <Button
          variant="destructive"
          className="h-32 text-3xl"
          onClick={() => handleRoleSelect("recruiter")}
        >
          Recruiter
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
