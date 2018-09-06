export default ({ host = 'https://badgen.net/', badgeURL }) => {
  const badgeSrc = host + (badgeURL || 'badge///blue')
  console.log(badgeURL)
  return (
    <div>
      <img src={badgeSrc} />
      <style jsx>{`
        div {
          height: 60px;
          text-align: center;
        }
      `}</style>
    </div>
  )
}
