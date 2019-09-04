import React from 'react';
import ReactDOM from 'react-dom';
import InputRange from 'react-input-range';
import {Chart} from 'react-google-charts';
import 'react-input-range/lib/css/index.css';
import './App.css'

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      values: [1000, 10, 12],
      valuesMax: [5000, 100, 30],
      labels: ['Loan', 'Interest Rate (Percent)', 'Duration (Months)'],
      installment: 200
    }
    this.createComponents = this.createComponents.bind(this);
    this.updateValues = this.updateValues.bind(this);
    this.updateMax = this.updateMax.bind(this);
    this.updateInstallment = this.updateInstallment.bind(this);
    this.calculateInstallment = this.calculateInstallment.bind(this);
  }


  calculateInstallment(rate, months, loan) {
    console.log(rate, months, loan)
    return (rate / 100. * loan + loan) / months
  }

  updateInstallment() {
    console.log(this.state.installment)
    this.setState({
      installment : this.calculateInstallment(
        this.state.values[1],
        this.state.values[2],
        this.state.values[0]
        )
      }
    )
  }

  genChartData(installment, duration) {
    let data = [['Months', 'Installment']]
    for(var i = 0; i < duration; i++) {
      data.push([i + 1, installment])
    }
    return data;
  }

  updateValues(i, e){
    let newValues = this.state.values.slice();
    newValues[i] = e;
    this.setState({values : newValues},
      this.updateInstallment
    );
  }

  updateMax(i, e){
    let newValuesMax = this.state.valuesMax.slice();
    newValuesMax[i] = e;
    this.setState({valuesMax : newValuesMax});
  }


  createComponents() {
    let components = [];
    for (var i = 0; i < 3; i++) {
      components.push(
        <App
          value = {this.state.values[i]}
          valueMax = {this.state.valuesMax[i]}
          onValueMaxChange = {this.updateMax.bind(this, i)}
          onValueChange = {this.updateValues.bind(this, i)}
          label = {this.state.labels[i]}
        />
      )
    }
    return components;
  }

  render() {
    return (
      <div>
        <div>
          {this.createComponents()}
        </div>
        <div>
          <Chart
            chartType="ColumnChart"
            //data={[["Age", "Weight"], [1, 5.5], [2, 12]]}
            data={this.genChartData(this.state.installment, this.state.values[2])}
            options = {{
              hAxis: { title: "Months" },
              vAxis: { title: "Payment", viewWindow: { min: 0, max: this.state.valuesMax[0] * 0.2} },
              legend: "none",
              width : '1300',
              height : '400',
              chartArea: {width : '80%', height : '80%'}
            }}

            width="100%"
            height="400px"
          />
        </div>
      </div>
    )
  }
/*
    render() {
      return (
        <div>
  
          <div> 
            <App 
              value = {this.state.loan} 
              valueMax = {this.state.loanMax}
              onValueChange = {newLoan => this.setState({loan : newLoan})} //Passing a non-static function causes rerendering fa nshoof taree2a a7san later
              onValueMaxChange = {newLoanMax => this.setState({loanMax : newLoanMax})}
              label = {"Loan"}
            />
          </div>
          <div>
            <App
              value = {this.state.rate}
              valueMax = {this.state.rateMax}
              onValueChange = {newRate => this.setState({rate : newRate})}
              onValueMaxChange = {newRateMax => this.setState({rateMax : newRateMax})}
              label = {"Interest Rate"}
            />
          </div>
          <div>
            <App
              value = {this.state.duration}
              valueMax = {this.state.durationMax}
              onValueChange = {newDuration => this.setState({duration : newDuration})}
              onValueMaxChange = {newMaxDuration => this.setState({durationMax : newMaxDuration})}
              label = {"Duartion (months)"}
            />
          </div>
        </div>
      );
    }
*/
  }

class App extends React.Component {
  changeValue(value) {
    if(value > this.props.valueMax)
      this.props.onValueChange(this.props.valueMax);
    else
      this.props.onValueChange(value);
  }

  render() {
    return (
      <div>
        <div className="heading">
          {this.props.label} 
        </div>
        <div className="containerTop">
          <div className="containerForm">
            <div> 
              <div style={{'textAlign': 'right'}}> Amount:</div>
              <input 
                className="textBox"
                type='text' 
                value={this.props.value}
                onChange={event => this.props.onValueChange(Number(event.target.value))}
              />
            </div>
          </div>
          <div className="containerSlider">
            <form className="form">
              <InputRange
                maxValue={this.props.valueMax}
                minValue={0}
                value={this.props.value}
                onChange={value => this.props.onValueChange(value)}
              />
            </form>
          </div>
            <div className="containerForm">
              Max:
              <input 
                className="textBox"
                type='text' 
                value={this.props.valueMax}
                onChange={event => this.props.onValueMaxChange(Number(event.target.value))}
              />
            </div>
          </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Main/>, 
  document.getElementById('app')
);
