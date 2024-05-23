namespace Kotshina.Models
{
    public class GameState
    {
        public Deck deck { get; set; }
        public Player Player { get; set; }
        public Player Computer { get; set; }
        public List<Card >TableCards { get; set; }
        public bool IsPlayerTurn { get; set; } = true;
    }
}
