using Kotshina.Data;
using Kotshina.Models;
using KotshinaGame.Data;
using Microsoft.AspNetCore.Diagnostics;
using System.Net;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IGameLogic,GameLogic>();
builder.Services.AddSingleton<GameState>();
builder.Services.AddScoped<HubService>();

//SignalR
builder.Services.AddSignalR();


builder.Services.AddCors(options =>
{
    options.AddPolicy(
        name: "AllowOrigin",
          builder => {
              builder.AllowAnyOrigin()
                      .AllowAnyMethod()
                      .AllowAnyHeader();
          });
});

var app = builder.Build();

app.UseCors("AllowOrigin");
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();

//app.UseCors();


app.UseHttpsRedirection();
app.UseEndpoints(endpoints => {
    endpoints.MapControllers();
    endpoints.MapHub<GamePlayHub>("/chat");
});


//app.MapControllers();

app.Run();

