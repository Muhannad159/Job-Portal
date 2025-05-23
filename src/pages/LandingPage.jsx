import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import companies from "../data/companies.json";
import faqs from "../data/faq.json";
import Autoplay from "embla-carousel-autoplay";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Landing = () => {
  return (
    <>
      <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20 ">
        <section className="text-center ">
          <h1 className="flex flex-col items-center justify-center gradient-title text-4xl font-extrabold sm:text-6xl lg:text-8xl tracking-tighter py-4">
            Find Your Dream Job{" "}
            <span className="flex items-center gap-2 sm:gap-6">
              and get <img src="/logo.png" className="h-14 sm:h-24 lg:h-32" />
            </span>
          </h1>
          <p className="text-gray-300 sm:mt-4 text-xs sm:text-2xl">
            Explore thousands of job listings or find the perfect candidate
          </p>
        </section>
        <div className="flex gap-6 justify-center">
          <Link to="/jobs">
            <Button variant="blue" size="xl">
              Find Jobs
            </Button>
          </Link>
          <Link to="/post-job">
            <Button variant="destructive" size="xl">
              Post a Job
            </Button>
          </Link>
        </div>
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full py-10"
        >
          <CarouselContent className="flex gap-4 sm:gap-20 items-center">
            {companies.map(({ name, id, path }) => {
              return (
                <CarouselItem key={id} className="basis-1/3 lg:basis-1/6">
                  <img
                    src={path}
                    alt={name}
                    className="h-9 sm:h-14 lg:h-40 object-contain"
                  />
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
        <div className="relative w-full h-165 bg-blue-900">
          <img src="/banner3.jpeg" className=" w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/70"></div>
          {/* <div className="absolute right-70 top-30 text-4xl font-bold  flex items-center ">
            Unlock Your Future
          </div> */}
        </div>

        <section className="grid grid-cols-1 px-4  md:grid-cols-2 gap-4 text-xl">
          <Card>
            <CardHeader>
              <CardTitle className="font-bold">For Job Seekers</CardTitle>
            </CardHeader>
            <CardContent>
              Search and apply for jobs, track applications, and more.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-bold">For Employers</CardTitle>
            </CardHeader>
            <CardContent>
              Post jobs, manage applications, and find the best candidates.
            </CardContent>
          </Card>
        </section>

        <Accordion type="multiple" className="w-full px-5">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger className="text-xl">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
    </>
  );
};

export default Landing;
