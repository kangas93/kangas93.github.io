import cv_picture from '../assets/images/Jussi_Kangas_VLTH9366.jpg'
import { education, worklife } from '../assets/text/cv_data';



function Home() {
    return (
        <div className='home'>
            <h1> Jussi Kangas</h1>
            <section className='home__bio'>
                <div className='home__img-wrapper'>
                    <img className="home__img" src={cv_picture} alt="Jussi Kangas"></img>
                </div>
                <div className='home__section'>
                    <p>"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."</p>
                </div>
            </section>
            <section className='home__cv'>
                <h2> Curriculum Vitae</h2>
                <div>
                    <h3> Education </h3>
                    <ul>
                        {education.map((school, index) => {
                            return (<li key={index}> <p>{school}</p></li>)
                        })}
                    </ul>

                </div>
                <div className='home__worklife'>
                    <h3> Work-life experience</h3>
                    <ul> {worklife.map((job) => {
                        return (<li key={job.company}>
                            <h4>{job.titel + ", " + job.company + ", " + job.start_period + " - " + job.end_period}</h4>
                            <p>{job.description}</p>
                        </li>)
                    })}</ul>
                </div>

            </section>

        </div>
    )
}

export default Home