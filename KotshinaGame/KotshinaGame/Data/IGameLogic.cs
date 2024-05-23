using Kotshina.Models;

namespace Kotshina.Data
{
    public interface IGameLogic
    {
        Task<Deck> InitializeDeck(Deck deck);
        Task  InitialCards( GameState gameState);
        Task<Card> ComputerTurn(GameState gameState);
        Task<int> EvaluateTable(Card card,GameState gameState);

    }
}
