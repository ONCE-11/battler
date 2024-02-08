import Character from "./Character";

const Battler = () => {
  return (
    <>
      <h1 className="text-6xl font-bold mb-4 mt-8">Fight!</h1>
      <div className="flex justify-between">
        <section>
          <Character
            character={{
              name: "Character 1",
              hp: 20,
              attack: 5,
              defense: 22,
              abilities: ["throw poop", "eat", "shower"],
              image:
                "https://www.fightersgeneration.com/np2/char2/char/guile-sfa3-side.jpg",
            }}
            playerOne={true}
          />
        </section>
        <section className="self-center font-bold text-8xl">VS</section>
        <section>
          <Character
            character={{
              name: "Character 2",
              hp: 10,
              attack: 50,
              defense: 56,
              abilities: ["throw poop", "eat", "shower"],
              image:
                "https://www.fightersgeneration.com/np2/char2/char/guile-sfa3-side.jpg",
            }}
          />
        </section>
      </div>
    </>
  );
};

export default Battler;
