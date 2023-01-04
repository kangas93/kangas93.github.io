import { useEffect, useRef, useState } from 'react';
import cv_picture from '../assets/images/Jussi_Kangas_VLTH9366.jpg'
import { educations, worklife, skills, biography, intro } from '../assets/text/cv_data';
import Typed from 'typed.js';



function Home() {
    const [skillStates, setSkillStates] = useState<Boolean[]>([])
    const skillStateRef = useRef(skillStates);

    useEffect(() => {
        var options = {
            typeSpeed: 100,
            backSpeed: 30,
            stringsElement: '.home__titel__elements',
            loop: true,
            loopCount: Infinity,
            backDelay: 1000,
        };

        var typed = new Typed('.home__titel__typed', options);

        return function cleanup() {
            typed.destroy()
        }

    }, [])

    useEffect(() => {
        const initialSkillStates = skills.map((skill) => false)
        setSkillStates(initialSkillStates);
    }, [])

    const onSkillButtonClick = (index: number) => {
        const tempSkills = [...skillStates];
        if (!tempSkills[index]) {
            tempSkills[index] = true;
            skillStateRef.current = tempSkills;
            setSkillStates(tempSkills)

            setTimeout(() => {
                const tempSkills = [...skillStateRef.current]
                tempSkills[index] = false;
                skillStateRef.current = tempSkills;
                setSkillStates(tempSkills)
            }, 4010)
        }
    }

    return (
        <div className='home'>
            <h1 className='home__titel'>
                <div className='home__titel__elements'>
                    <span>Welcome!</span>
                    <span>My name is Jussi.</span>
                    <span>I'm a developer.</span>
                </div>
                <span className='home__titel__typed'></span>
            </h1>
            <section className='home__bio'>
                <div className='home__img-wrapper'>
                    <img className="home__img" src={cv_picture} alt="Jussi Kangas"></img>
                </div>
                <div className='home__bio-section'>
                    <h2>About Jussi Kangas</h2>
                    <p>{intro}</p>
                    <p>{biography}</p>
                </div>
            </section>
            <section className='home__cv'>
                <h2> Curriculum Vitae</h2>
                <div className="home__skills">
                    <h3>Skills</h3>
                    <ul>
                        {skills.map((skill, index) => {
                            return (<li key={skill}><button onClick={() => onSkillButtonClick(index)} className={skillStates[index] ? "home__skills--dissolve" : ""} type="button" ><p>{skill}</p></button></li>)
                        })}

                    </ul>

                </div>
                <div className='home__education'>
                    <h3> Education </h3>
                    <ul>
                        {educations.map((education, index: number) => {
                            return (<li key={index}>
                                <h4>{'Education: ' + education.program}</h4>
                                <h4>{'Credits: ' + education.credits}</h4>
                                <h4>{'Period: ' + education.period}</h4>
                            </li>)
                        })}
                    </ul>

                </div>
                <div className='home__worklife'>
                    <h3> Work-life experience</h3>
                    <ul> {worklife.map((job) => {
                        return (<li key={job.company}>
                            <h4>{'Job: ' + job.titel} </h4>
                            <h4>{'Company: ' + job.company} </h4>
                            <h4>{'Period: ' + job.start_period + " - " + job.end_period} </h4>
                            <h4>Description:</h4>
                            <p>{job.description}</p>
                        </li>)
                    })}</ul>
                </div>

            </section>

        </div>
    )
}

export default Home