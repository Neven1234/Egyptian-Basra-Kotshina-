namespace Kotshina.Models
{
    public class Player
    {
        public List<Card> Hand { get; set; }=new List<Card>();
        public int Score { get; set; }
    }
}
