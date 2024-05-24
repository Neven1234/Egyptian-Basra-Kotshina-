namespace Kotshina.Models
{
    public class GameState
    {
        public Deck deck { get; set; }
        public Player Player { get; set; }
        public Player Computer { get; set; }
        public List<Card >TableCards { get; set; }

        public int LastOne { get; set; } // 0 means computer was the last player how take score , 1 means it was the player 
        public bool IsPlayerTurn { get; set; } = true;
    }
}
