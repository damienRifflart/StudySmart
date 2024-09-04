function Welcome() {
  const formattedDate = (): string => {
    var today = new Date();
    var day = today.getDay();
    var month = today.toLocaleString('default', { month: 'long' });
    var year = today.getFullYear();

    return `${day} ${month} ${year}`;
  }

  return(
    <div className="w-fit text-4xl">
      <h1>Bonjour,</h1>
      <h1>On est le <span className="text-accent">{formattedDate()}</span></h1>
    </div>
  )
}

export default Welcome;