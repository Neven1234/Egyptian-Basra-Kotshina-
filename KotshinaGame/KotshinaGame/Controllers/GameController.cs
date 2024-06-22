using Kotshina.Data;
using Kotshina.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace KotshinaGame.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private readonly IGameLogic _gameLogic;
        private readonly GameState _gameState;

        public  GameController(IGameLogic gameLogic,GameState gameState)
       {
           _gameLogic = gameLogic;
           _gameState = gameState;
        }
        [HttpGet("new-game")]
        public async Task<IActionResult> StartGame()
        {
            Deck deck = new Deck();
            deck= await _gameLogic.InitializeDeck(deck);
            _gameState.Player = new Player();
            _gameState.Computer = new Player();
            _gameState.TableCards = new List<Card>();
            _gameState.IsPlayerTurn = true;
            _gameState.LastOne = 0;
            _gameState.deck = deck;
            
            _gameLogic.InitialCards(_gameState);
            return Ok(_gameState);
        }

        [HttpPost("player-turn")]
        public async Task<IActionResult> Player( Card card)
        {
           
            var cardToPlay=_gameState.Player.Hand.FirstOrDefault(c=>c.Value==card.Value && c.Suits==card.Suits);
            if (cardToPlay != null && _gameState.IsPlayerTurn)
            {
                _gameState.Player.Hand.Remove(cardToPlay);
                var score= await _gameLogic.EvaluateTable(card, _gameState);
                if (score != 0)
                {
                    _gameState.LastOne = 1;
                }
                _gameState.Player.Score += score;
                _gameState.IsPlayerTurn = false;
                CheckToReFeal(_gameState);
                return Ok(new
                {
                    cardPlayed = cardToPlay,
                    GameState = _gameState
                });
            }
           return BadRequest();

        }

        [HttpPost("computer-turn")]
        public async Task<IActionResult> Computer()
        {
            if(_gameState.IsPlayerTurn)
            {
                return BadRequest();
            }
            Card cardToPlay = await _gameLogic.ComputerTurn(_gameState);
            if (cardToPlay != null )
            {
                _gameState.Computer.Hand.Remove(cardToPlay);
                var score= await _gameLogic.EvaluateTable(cardToPlay, _gameState);
                if (score != 0)
                {
                    _gameState.LastOne = 0;
                }
                if(_gameState.deck.Cards.Count()==0 && _gameState.Computer.Hand.Count() == 0)
                {
                    if (_gameState.LastOne == 0)
                    {
                        score += _gameState.TableCards.Count();  
                    }
                    else
                    {
                        _gameState.Player.Score+= _gameState.TableCards.Count();

                    }
                    _gameState.TableCards.Clear();
                }
                _gameState.Computer.Score += score;
                _gameState.IsPlayerTurn = true;
                CheckToReFeal(_gameState);
                return Ok(new
                {
                    cardPlayed=cardToPlay,
                    GameState = _gameState
                });
            }
            return BadRequest();
               
        }

        [HttpGet("check-winner")]
        public async Task<IActionResult> CheckWinner()
        {
            int result; // 1 player win, 0 computer win, -1 Draw
            if (_gameState.deck.Cards.Count == 0)
            {
                result = _gameState.Player.Score > _gameState.Computer.Score ? 1 : _gameState.Computer.Score==_gameState.Player.Score?-1:0;
                return Ok(result);
            }
            return BadRequest();
        }

        [HttpGet("gameState")]
        public async Task<IActionResult> GetGameState()
        {
            return Ok( _gameState);
        }

        [NonAction]
        public void CheckToReFeal(GameState gameState)
        {
            if (gameState.deck.Cards.Count() == 0)
            {
                return;
            }
            if(gameState.Player.Hand.Count() == 0 && gameState.Computer.Hand.Count()==0)
            {
                gameState.Player.Hand.AddRange(gameState.deck.Cards.GetRange(0, 4));
                gameState.deck.Cards.RemoveRange(0, 4);
                gameState.Computer.Hand.AddRange(gameState.deck.Cards.GetRange(0, 4));
                gameState.deck.Cards.RemoveRange(0, 4);
            }

        }

       
    }
}
