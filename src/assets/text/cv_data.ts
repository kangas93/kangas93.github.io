interface Job {
    titel: string;
    company: string;
    start_period: string;
    end_period: string;
    description: string;
}

interface EducationProgram {
    program: string;
    credits: string;
    period: string;
}

const skills = ['Clean code', 'Vue.js', 'React.js', 'TypeScript', 'JavaScript', 'CSS', 'SCSS', 'Git', 'Python', 'Docker', 'Usability', 'Accessability', 'C#', '.NET', 'Data visualization']

const educations: EducationProgram[] = [
    { program: "Exchange program at DTU Technical University of Denmark", credits: "30 ECTS", period: "Spring semester 2020" },
    { program: "Master’s program in Computer Science, KTH Royal Institute of Technology", credits: "120 ECTS", period: "2019 - 2021" },
    { program: "Bachelor’s program in Media Technology, KTH Royal Institute of Technology", credits: "180 ECTS", period: "2017 - 2019" }]

const worklife: Job[] = [
    { titel: "Full-stack developer", company: "Tikab", start_period: "October 2022", end_period: "December 2022", description: "Full-stack development with React, Python, Django and Three.js" },
    { titel: "Front-end developer", company: "Valtech", start_period: "September 2021", end_period: "October 2022", description: "Technical consultant with focus on front-end development. The main client during this period was Kinnarps. The tech-stack consisted of Vue.js, .NET, Episerver, and SCSS." },
    { titel: "Master's thesis", company: "SVT Interactive", start_period: "January 2021", end_period: "June 2021", description: "Master thesis conducted at SVT Interactive with focus on usability in data visualizations." },
]

const intro = "Hi!\n\nMy name is Jussi Kangas, I’m a front-end developer and aspiring full-stack developer.\nOn this site you can find info about my skills, my experience and projects (work-in-progress)."
const biography = "As a developer I like to practice clean code principles to create code that is both easy to read and to maintain. Collaboration is close to my heart and I believe the best code is often produced together through collaboration. It’s also more fun!"


export { educations, worklife, skills, biography, intro } 