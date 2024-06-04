using Kotshina.Models;
using Microsoft.AspNetCore.SignalR;

namespace KotshinaGame.Data
{
    public class GamePlayHub:Hub
    {
        public Task JoinGroup()
        {
            //message send to receiver only
            return Groups.AddToGroupAsync(Context.ConnectionId,"Game");

        }
    }
}
