import cv_picture from '../assets/images/Jussi_Kangas_VLTH9366.jpg'
import { educations, worklife, skills, biography, intro } from '../assets/text/cv_data';



function Home() {
    return (
        <div className='home'>
            <h1> Jussi Kangas</h1>
            <section className='home__bio'>
                <div className='home__img-wrapper'>
                    <img className="home__img" src={cv_picture} alt="Jussi Kangas"></img>
                </div>
                <div className='home__bio-section'>
                    <h2>About me</h2>
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
                            return (<li key={skill}><p>{skill}</p></li>)
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