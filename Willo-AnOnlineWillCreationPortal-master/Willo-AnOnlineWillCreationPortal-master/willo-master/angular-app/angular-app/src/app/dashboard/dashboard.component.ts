import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import { ChartModule } from 'angular2-chartjs';
Chart.defaults.global.animation.duration=800;
//+Chart.defaults.global.scales.ticks.beginAtZero = true;
Chart.defaults.scale.ticks.beginAtZero = true;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  constructor(private Auth:AuthService, private router: Router) { }

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [];
  public pieChartData = [];
  public lineChartData = [];
  
  public myBarChart;
  public myLineChart;
  public myPieChart;

  public lineChartLabels = [];
  
  public barChartLabels = [];
  public pieChartLabels = [];
  public data1 = [];
  public dataPie = [];
  public stateWiseData = [];

  ngOnInit() 
  {
    console.log("Reached ngOnInit for dashboard")
    console.log(this.Auth.getLoggedInStatus())
    if(!this.Auth.getLoggedInStatus())
    {
      //this.router.navigate(['/login'])
    }

    this.plotOnNavi();
  }

  public plotOnNavi()
  {
    this.Auth.getStatsDetails().subscribe(data=>{
            var self = this;
            console.log(data);
            data.forEach(function (value){
              console.log(value.year_mm);
              self.barChartLabels.push(value.year_mm);
              self.lineChartLabels.push(value.year_mm);
              self.data1.push(value.amount);
            });
            this.barChartData = [{data:this.data1, label: 'Series A'}];
            this.loadCharts();

            });

    this.Auth.getPieDetails().subscribe(data=>{
            var self=this;
            console.log(data);
            data.forEach(function(value){
            self.pieChartLabels.push(value.state); 
            self.dataPie.push(value.count_user);             
            });
            this.loadCharts();
    });
  }

  public loadCharts()
  {
    var color = Chart.helpers.color;
    
    var data2={ labels:this.barChartLabels, 
                datasets:[
                            {
                                    backgroundColor: [
                                      'rgba(255, 99, 132, 0.2)',
                                      'rgba(54, 162, 235, 0.2)',
                                      'rgba(255, 206, 86, 0.2)',
                                      'rgba(75, 192, 192, 0.2)',
                                      'rgba(153, 102, 255, 0.2)',
                                      'rgba(255, 159, 64, 0.2)',
                                      'rgba(255, 99, 132, 0.2)',
                                      'rgba(54, 162, 235, 0.2)',
                                      'rgba(255, 206, 86, 0.2)',
                                      'rgba(75, 192, 192, 0.2)',
                                      'rgba(153, 102, 255, 0.2)',
                                      'rgba(255, 159, 64, 0.2)',
                                      'rgba(255, 99, 132, 0.2)',
                                      'rgba(54, 162, 235, 0.2)',
                                      'rgba(255, 206, 86, 0.2)',
                                      'rgba(75, 192, 192, 0.2)',
                                      'rgba(153, 102, 255, 0.2)',
                                      'rgba(255, 159, 64, 0.2)'
                                  ],
                                  borderColor: [
                                      'rgba(255, 99, 132, 1)',
                                      'rgba(54, 162, 235, 1)',
                                      'rgba(255, 206, 86, 1)',
                                      'rgba(75, 192, 192, 1)',
                                      'rgba(153, 102, 255, 1)',
                                      'rgba(255, 159, 64, 1)',
                                      'rgba(255, 99, 132, 0.2)',
                                      'rgba(54, 162, 235, 0.2)',
                                      'rgba(255, 206, 86, 0.2)',
                                      'rgba(75, 192, 192, 0.2)',
                                      'rgba(153, 102, 255, 0.2)',
                                      'rgba(255, 159, 64, 0.2)',
                                      
                                  ],
                                  borderWidth: 1,
                                    data:this.data1
                            }
                          ]

                          
                                                      
              };
              



              var data3={ labels:this.pieChartLabels, 
                datasets:[
                            {       
                                    label:"State-wise subscribers",
                                    backgroundColor: [
                                      'rgba(255, 99, 132, 0.2)',
                                      'rgba(54, 162, 235, 0.2)',
                                      'rgba(255, 206, 86, 0.2)',
                                      'rgba(75, 192, 192, 0.2)',
                                      'rgba(153, 102, 255, 0.2)',
                                      'rgba(255, 159, 64, 0.2)',
                                      'rgba(255, 99, 132, 0.2)',
                                      'rgba(54, 162, 235, 0.2)',
                                      'rgba(255, 206, 86, 0.2)',
                                      'rgba(75, 192, 192, 0.2)',
                                      'rgba(153, 102, 255, 0.2)',
                                      'rgba(255, 159, 64, 0.2)',
                                      'rgba(255, 99, 132, 0.2)',
                                      'rgba(54, 162, 235, 0.2)',
                                      'rgba(255, 206, 86, 0.2)',
                                      'rgba(75, 192, 192, 0.2)',
                                      'rgba(153, 102, 255, 0.2)',
                                      'rgba(255, 159, 64, 0.2)'
                                  ], 
                                   
                                    data:this.dataPie
                            }
                          ]

                                                      
              };

              var data4={ labels:this.lineChartLabels, 
                datasets:[
                            {       
                                    label:"State-wise subscribers",
                                    borderColor: "#3e95cd",
                                    fill: true,
                                    //lineTension : 0.9,
                                    data:this.data1
                            }
                          ]

  
    };

    var canvas1 = <HTMLCanvasElement>document.getElementById("myChart");
    var ctx1 = canvas1.getContext("2d");
    this.myBarChart = new Chart(ctx1, {
                                     type: 'bar',
                                     data: data2,
                                     options: {
                                                scales:{
                                                  xAxes: [{
                                                    barPercentage: 0.5,
                                                    gridLines: {
                                                        offsetGridLines: true
                                                    },
                                                    scaleLabel: {
                                                      display: true,
                                                      labelString: 'Time'
                                                    }
                                                }],
                                                  yAxes:[
                                                  {
                                                    ticks:{
                                                      beginAtZero: true,
                                                      callback: function(value, index, values) {
                                                        return '$' + value;
                                                    }
                                                    },
                                                    
                                                  }
                                                  ]
                                                },
                                                responsive:true,
                                                maintainAspectRatio: false,
                                                legend: { display: false },
                                                title: {
                                                  display: true,
                                                  fontSize: 15,
                                                  text: 'Monthly earnings report'
                                                }
                                              }
                                      });

    var canvas2 = <HTMLCanvasElement>document.getElementById("myChart4");
    var ctx2 = canvas2.getContext("2d");
    
    this.myLineChart = new Chart(ctx2, {
                                     type: 'line',
                                     data: data4,
                                     
                                     options: {
                                      legend: { 
                                        display: false,
                                        labels: {
                                          fontColor: '#fffff',
                                          fontSize: 15,
                                          padding: 12
                                                },
                                        position: 'right'
                                      },
                                      scales:{
                                        xAxes: [{
                                          barPercentage: 0.7,
                                          gridLines: {
                                            color: "rgba(0, 0, 0, 0)",
                                            offsetGridLines: false
                                        },
                                        
                                        ticks:{
                                          beginAtZero: true
                                        },
                                        scaleLabel: {
                                          display: true,
                                          labelString: 'Time'
                                        }
                                        }],
                                          yAxes:[
                                          {
                                            gridLines: {
                                              color: "rgba(0, 0, 0, 0)",
                                              offsetGridLines: false
                                          },
                                            ticks:{
                                              beginAtZero: true,
                                              callback: function(value, index, values) {
                                                return '$' + value;
                                            }
                                            },
                                            scaleLabel: {
                                              display: true,
                                              labelString: 'Income'
                                            }
                                          }
                                          ]
                                      },
                                     
                                      responsive:true,
                                      maintainAspectRatio: false,
                                     
                                      title: {
                                        display: true,
                                        fontSize: 15,
                                        text: 'Monthly earnings report'
                                      },
                                      
                                    }
                                  }
                                );

    var canvas3 = <HTMLCanvasElement>document.getElementById("myChart3");
    var ctx3 = canvas3.getContext("2d");
    
    // For a pie chart
    this.myPieChart = new Chart(ctx3, {
                                      type: 'doughnut',
                                      data: data3,
                                      options: {
                                        
                                        responsive:true,
                                        maintainAspectRatio: false,
                                        legend: { 
                                          display: true,
                                          labels: {
                                            fontColor: '#fffff',
                                            fontSize: 15,
                                            padding: 12
                                          },
                                          position: 'right'
                                        },
                                        title: {
                                          display: true,
                                          fontSize: 15,
                                          
                                          text: 'State-wise subscribers'
                                        }
                                      }
                                
                                });

  }

  public onClickDashboard()
  {
    console.log("Reached onClickDashboard")
    this.Auth.setLoggedInStatus(true)
  }

}
