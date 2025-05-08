import type { Route } from "./+types/about";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About" },
    { name: "description", content: "Learn more about my background, expertise, and experience in software development." },
  ];
}

export default function About() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* About Me Section */}
      <section className="mb-12">
        <h1 className="text-4xl font-bold text-[#E8F5E8] mb-6">About Me</h1>
        <div className="card">
          <p className="text-[#A3C9A3] text-lg leading-relaxed">
            Howdy! I'm an electrical engineer turned software developer. For a full employment history and picture check out my <a href="https://www.linkedin.com/in/your-profile" className="text-[#4CAF50] hover:text-[#66BB6A] underline" target="_blank" rel="noopener noreferrer">LinkedIn</a>.
          </p>
        </div>
      </section>

      {/* Relevant Experience Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-[#E8F5E8] mb-6">Relevant Experience</h2>
        <div className="space-y-8">
          {/* BuildWitt */}
          <div className="card">
            <h3 className="text-xl font-semibold text-[#E8F5E8]">Senior Software Engineer | BuildWitt</h3>
            <p className="text-[#A3C9A3] mb-2">July 2024 to Present</p>
            <ul className="text-[#A3C9A3] list-disc pl-6 space-y-1">
              <li>Designing & developing software in .NET and React</li>
            </ul>
          </div>

          {/* Texas A&M */}
          <div className="card">
            <h3 className="text-xl font-semibold text-[#E8F5E8]">Software Applications Developer III | Texas A&M University</h3>
            <p className="text-[#A3C9A3] mb-2">Jan. 2019 to July 2024</p>
            <ul className="text-[#A3C9A3] list-disc pl-6 space-y-1">
              <li>Spearheaded adoption of DevOps: CI/CD, git versioning, branching strategy, and release note generation</li>
              <li>Evaluated and improved SDLC for agile development</li>
              <li>Oversee a team of student workers and mentor junior developers</li>
              <li>Developing KPIs, general system, application, and SDLC design guidelines</li>
              <li>Daily in C# and javascript. Occasionally in Python, Powershell, and SQL</li>
            </ul>
          </div>

          {/* theTestimony.us */}
          <div className="card">
            <h3 className="text-xl font-semibold text-[#E8F5E8]">Software Developer | theTestimony.us</h3>
            <p className="text-[#A3C9A3] mb-2">Feb. 2019 to Present</p>
            <ul className="text-[#A3C9A3] list-disc pl-6 space-y-1">
              <li>Led full-stack design of a web application for conference registration, application tracking, and invoicing</li>
              <li>Oversee backlog and feature planning</li>
              <li>Refactored from Vue2 to Vue3. Refactored from native components to Syncfusion.</li>
              <li>Refactoring from SPA to HTMX and jQuery datatables and from layered architecture to vertical slice architecture.</li>
              <li>Daily in C#, VueJs/Typescript, UIkit, HTMX, Azure, Razor Pages, EF Core</li>
            </ul>
          </div>

          {/* Previous Experience */}
          <div className="card">
            <h3 className="text-xl font-semibold text-[#E8F5E8]">Previous Experience</h3>
            <ul className="text-[#A3C9A3] list-disc pl-6 space-y-4">
              <li>
                <strong>Software Developer | Attendance Project</strong> (May 2017 - Dec 2018)
                <ul className="list-disc pl-6 mt-2">
                  <li>Led the final development and operational stages of a rewrite project (PHP to Django+React)</li>
                  <li>Led the migration from python 2 to python 3</li>
                  <li>Python 2.7, Django, Postgresql, nginx, Travis CI</li>
                </ul>
              </li>
              <li>
                <strong>Embedded Software Engineer | Otis Instruments</strong> (May 2016 - Dec 2016)
                <ul className="list-disc pl-6 mt-2">
                  <li>Provided software updates to gas detection sensors and monitors</li>
                  <li>Developed and debugged C software on Microchip PIC processors</li>
                </ul>
              </li>
              <li>
                <strong>Senior Design - Cycle X-Pro | Texas A&M University</strong> (Jan 2016 - Dec 2016)
                <ul className="list-disc pl-6 mt-2">
                  <li>Developed an Android and C/Arduino Bluetooth protocol</li>
                  <li>Developed an Android and Django REST interface</li>
                </ul>
              </li>
              <li>
                <strong>Undergraduate Research | Texas A&M University</strong> (Jan 2014 - Dec 2015)
                <ul className="list-disc pl-6 mt-2">
                  <li>Led multiple product design and development projects</li>
                  <li>Programmed user-defined function generators in MATLAB</li>
                </ul>
              </li>
              <li>
                <strong>Product Management Intern | Siemens Energy Management</strong> (May 2015 - Aug 2015)
                <ul className="list-disc pl-6 mt-2">
                  <li>Learned Python to contribute to embedded software</li>
                  <li>Microservices, ZeroMQ, HTTP REST API client development</li>
                </ul>
              </li>
              <li>
                <strong>Electrical Engineering Intern | MeadWestVaco</strong> (Jan 2014 - May 2014)
                <ul className="list-disc pl-6 mt-2">
                  <li>Learned VB to develop a UI in excel to programmatically monitor breaks in paper machines</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-[#E8F5E8] mb-6">Skills & Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
            <h3 className="text-xl font-semibold text-[#E8F5E8] mb-3">Extensive Experience</h3>
            <ul className="text-[#A3C9A3] space-y-2">
              <li>.NET (C#)</li>
              <li>Django (Python)</li>
              <li>Vue 3</li>
              <li>HTMX</li>
              <li>Client-side javascript and typescript</li>
            </ul>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold text-[#E8F5E8] mb-3">Limited Experience</h3>
            <ul className="text-[#A3C9A3] space-y-2">
              <li>Node (js)</li>
              <li>React, Angular</li>
              <li>CSS/LESS/SASS</li>
              <li>Boostrap, UIKit</li>
              <li>Go</li>
            </ul>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold text-[#E8F5E8] mb-3">Minimal Experience</h3>
            <ul className="text-[#A3C9A3] space-y-2">
              <li>Kotlin, C, C++, Java</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Other Projects Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-[#E8F5E8] mb-6">Other Projects</h2>
        <div className="card">
          <ul className="text-[#A3C9A3] space-y-2">
            <li>HXML.NET</li>
          </ul>
        </div>
      </section>

      {/* Learning Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-[#E8F5E8] mb-6">Learning</h2>
        <div className="card">
          <ul className="text-[#A3C9A3] space-y-2">
            <li>Present - Writing an Interpreter in Go</li>
            <li>Present - Frontend Masters - Algorithms [Go]</li>
            <li>Jan. 2024 - Dynamic Programming [Go] [C#]</li>
            <li>Oct. 2023 - Hypermedia Systems</li>
            <li>Jan. 2023 - The Unicorn Project</li>
            <li>Nov. 2022 - Azure AZ-900</li>
            <li>Oct. 2022 - The Phoenix Project</li>
          </ul>
        </div>
      </section>
    </div>
  );
} 