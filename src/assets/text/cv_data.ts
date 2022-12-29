interface Job {
    titel: string;
    company: string;
    start_period: string;
    end_period: string;
    description: string;
}

const education = [
    "Exchange program at DTU Technical University of Denmark, 30 ECTS,  Spring semester 2020",
    "Master’s program in Computer Science, KTH Royal Institute of Technology, 120 ECTS, 2019 - 2021",
    "Bachelor’s program in Media Technology, KTH Royal Institute of Technology, 180 ECTS, 2017 - 2019"]

const worklife: Job[] = [
    { titel: "Full-stack developer", company: "Tikab", start_period: "October 2022", end_period: "December 2022", description: "Full-stack development with React, Python, Django and Three.js" },
    { titel: "Front-end developer", company: "Valtech", start_period: "September 2021", end_period: "October 2022", description: "Technical consultant with focus on front-end development." },
    { titel: "Master thesis", company: "SVT Interactive", start_period: "January 2021", end_period: "June 2021", description: "Master thesis conducted at SVT Interactive with focus on usability in data visualizations." },
]
export { education, worklife } 