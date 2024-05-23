using Kotshina.Models;
using System.Collections.Generic;

namespace Kotshina.Data
{
    public class GameLogic : IGameLogic
    {
        public async Task<int> EvaluateTable(Card card, GameState gameState)
        {
            int score = 0;
            if (gameState.TableCards.Count() == 0)
            {
                gameState.TableCards.Add(card);
                return score;
            }
            // if card is a Jack
            if (card.Value == "J")
            {
                score = gameState.TableCards.Count();
                gameState.TableCards.Clear();
                score++;
                return score;
            }
            //If card is a 7 diamonds
            else if (card.Value == "7" && card.Suits == "Diamonds")
            {
                int sum = 0;
                foreach (var cardInTable in gameState.TableCards)
                {
                    if ( cardInTable.Value == "K" || cardInTable.Value == "Q")
                    {
                        break;
                    }
                    sum += int.Parse(cardInTable.Value);
                }
                if (sum >= 10)
                {
                    score = gameState.TableCards.Count();
                    gameState.TableCards.Clear();
                }
                else
                {
                   return 10;
                    
                }
                score++;
                return score;
            }
            

            //check for sum 
           else if (card.Value != "K" && card.Value!="Q")
            {
                var subsets = GetSubsetsThatSumToValue(gameState.TableCards, int.Parse(card.Value));
                if (subsets.Any())
                {
                    foreach (var subset in subsets)
                    {
                        foreach (var subsetCard in subset)
                        {
                            gameState.TableCards.Remove(subsetCard);
                            score++;
                        }
                    }
                }
                if(gameState.TableCards.Count() == 0)
                {
                    return 10; 
                }
            }
            //Check for match
           var matchingCards = gameState.TableCards.Where(c => c.Value == card.Value).ToList();
            foreach (var matchingCard in matchingCards)
            {
                gameState.TableCards.Remove(matchingCard);
                score++;
                if (gameState.TableCards.Count() == 0)
                {
                    return 10;
                }
            }
            if (score == 0)
            {
                gameState.TableCards.Add(card);
                return score;
            }
            score++;
            return score;
        }

        public async Task<Card> ComputerTurn(GameState gameState)
        {
            Card cardToPlay = null;
            int maxSum = 0;

            //Check for sum in table cards equal to computer card
            foreach(var computercard in gameState.Computer.Hand)
            {
                if(computercard.Value=="J" || computercard.Value=="7"&& computercard.Suits== "Diamonds")
                {
                    cardToPlay = computercard;
                    break;
                }
                else if (computercard.Value == "K" || computercard.Value == "Q" )
                {
                    continue;
                }
                else 
                {
                    int sumOfSumset = 0;
                    var subsets = GetSubsetsThatSumToValue(gameState.TableCards, int.Parse(computercard.Value));
                    if (subsets.Any())
                    {
                        foreach (var subset in subsets)
                        {
                            foreach (var subsetCard in subset)
                            {
                                
                                sumOfSumset++;
                            }
                        }
                        if (sumOfSumset > maxSum)
                        {
                            maxSum = sumOfSumset;
                            cardToPlay = computercard;
                        }
                    }
                   
                }
                if (cardToPlay != null) break;
            }
            if (cardToPlay == null)
            {
                cardToPlay =  gameState.Computer.Hand.FirstOrDefault(computerCard =>
                gameState.TableCards.Any(cardOnTable => cardOnTable.Value == computerCard.Value));
            }
            if(cardToPlay == null)
            {
                cardToPlay =  gameState.Computer.Hand.First();
            }
            
            return cardToPlay;
        }

        public async Task InitialCards(GameState gameState)
        {
            gameState.Player.Hand.AddRange(gameState.deck.Cards.GetRange(0, 4));
            gameState.deck.Cards.RemoveRange(0, 4);
            gameState.Computer.Hand.AddRange(gameState.deck.Cards.GetRange(0, 4));
            gameState.deck.Cards.RemoveRange(0, 4);
            gameState.TableCards.AddRange(gameState.deck.Cards.GetRange(0, 4));
            gameState.deck.Cards.RemoveRange(0, 4);
            gameState.TableCards = await HandelSpecialCardsForTable(gameState.deck, gameState.TableCards, 0);
           

        }

        public async Task<Deck> InitializeDeck(Deck deck)
        {
                List<string> Values = new List<string> {"1","2","3","4","5","6","7","8","9","10","J","Q","K"};
                List<string> Suits = new List<string>{ "Hearts","Diamonds","Clubs","Spades" };
                foreach (var suit in Suits)
                {
                    foreach (var value in Values)
                    {
                        deck.Cards.Add(new Card { Suits = suit, Value = value });
                    }
                }
                 await Shuffle(deck.Cards);
            return  deck;
        }
        //Helper Functions
        public async Task Shuffle(List<Card> cards)
        {
            var rng = new Random();
            int n = cards.Count;
            while (n > 1)
            {
                n--;
                int k = rng.Next(n + 1);
                var value = cards[k];
                cards[k] = cards[n];
                cards[n] = value;
            }
        }

        public async Task< List<Card>> HandelSpecialCardsForTable(Deck deck, List<Card> TableCards,int c)
        {
            

            foreach (var card in TableCards)
            {
                if(card.Value=="7" && card.Suits== "Diamonds" || card.Value == "J")
                {
                    deck.Cards.Add(card);
                    TableCards.Remove(card);
                    TableCards.Add(deck.Cards[c]);
                    deck.Cards.RemoveAt(c);
                    TableCards=await HandelSpecialCardsForTable(deck,TableCards,c++);
                }
            }
            return TableCards;
        }

        private List<List<Card>> GetSubsetsThatSumToValue(List<Card> cards, int targetValue)
        {
            var result = new List<List<Card>>();
            GetSubsetsThatSumToValueRecursive(cards, targetValue, new List<Card>(), result, 0);
            return result;
        }
        private void GetSubsetsThatSumToValueRecursive(List<Card> cards, int targetValue, List<Card> currentSubset, List<List<Card>> result, int start)
        {
            if (targetValue == 0)
            {
                result.Add(new List<Card>(currentSubset));
                return;
            }

            for (int i = start; i < cards.Count; i++)
            {
                if (cards[i].Value== "K" || cards[i].Value== "Q")
                {
                    continue;
                }
                else if (int.Parse(cards[i].Value) <= targetValue)
                {
                    currentSubset.Add(cards[i]);
                    GetSubsetsThatSumToValueRecursive(cards, targetValue - int.Parse(cards[i].Value), currentSubset, result, i + 1);
                    currentSubset.RemoveAt(currentSubset.Count - 1);
                }
            }
        }
    }
}
