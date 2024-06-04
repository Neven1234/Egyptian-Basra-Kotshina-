using Kotshina.Models;
using Microsoft.AspNetCore.SignalR;

namespace KotshinaGame.Data
{
    public class HubService
    {
        private readonly IHubContext<GamePlayHub> _hubContext;

        public HubService(IHubContext<GamePlayHub> hubContext)
        {
            _hubContext = hubContext;
        }
        public async Task UpdateGameState(GameState gameState)
        {
            await _hubContext.Clients.All.SendAsync("UpdateGameState", gameState);
        }
    }
}
