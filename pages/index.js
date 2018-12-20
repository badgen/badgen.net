import liveBadges from '../libs/examples-live.js'
import BadgeExamples from '../components/badge-examples.js'
import Header from '../components/home-header.js'
import Intro from '../components/home-intro.js'
import Footer from '../components/footer.js'

export default ({ children }) => <>
  <Header />
  <div className='docs'>
    <Intro />
    <h3 style={{ textAlign: 'center' }}>Examples</h3>
    <p>
      live badges / <a href='/gallery/static'>static badges</a>
    </p>
    <BadgeExamples data={liveBadges} />
  </div>
  <Footer />
  <style jsx>{`
    .docs {
      width: 960px;
      margin: 0 auto;
      padding-bottom: 6em;
    }
    p {
      text-align: center
    }
  `}</style>
</>
