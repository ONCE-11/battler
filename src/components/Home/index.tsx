import Title from "../Title";

const Home = () => {
  return (
    <>
      <Title text="Beef?" />
      <p className="my-4 text-xl">
        In the future, most of humanity is dead and all that is left is the
        thrill of the fight. Everyone is on edge and they need resources in
        order to make it one more day. Your currency is chelitos (ch) and you
        can earn it by killing, stealing or saboutaging other players. Have fun
        beefin'!
      </p>

      <section>
        <h2 className="my-4 text-xl font-bold">How to Play</h2>
        <ul>
          <li>Step 1: Create a character</li>
          <li>Step 2: Start beefin' with people</li>
          <li>Step 3: ???</li>
          <li>Step 4: Profit</li>
        </ul>
      </section>

      <section>
        <h2 className="my-4 text-xl font-bold">Info</h2>
        <ul>
          <li>
            Once you start beefin' with someone you can mess with them, and they
            can mess with you
          </li>
          <li>Expect surprises</li>
        </ul>
      </section>

      <section>
        <h2 className="my-4 text-xl font-bold">Tips</h2>
        <ul>
          <li>Use your abilities wisely</li>
          <li>Be tactical</li>
          <li className="underline">Be ruthless, players will have no mercy</li>
        </ul>
      </section>
    </>
  );
};

export default Home;
