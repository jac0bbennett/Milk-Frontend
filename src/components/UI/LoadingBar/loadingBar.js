import React, { Component } from "react";

// class LoadingBar extends Component {
//   state = {}

//   render() {
//     return <div id="loadingbar" style={this.props.loadBar} />;
//   }

//   handleHideLoadBar = () => {
//     const app = this;
//     const loadBar = { ...this.state.loadBar };
//     loadBar.visibility = "hidden";
//     loadBar.width = "0px";
//     setTimeout(function() {
//       app.setState({ loadBar });
//     }, 200);
//   };

//   handleLoadBarChange = width => {
//     const loadBar = { ...this.state.loadBar };
//     if (width === "100%" || width === "101%") {
//       loadBar.visibility = "visible";
//       loadBar.width = "101%";
//       this.setState({ loadBar });
//       this.handleHideLoadBar();
//     } else {
//       loadBar.visibility = "visible";
//       loadBar.width = width;
//       this.setState({ loadBar });
//     }
//   };
// }

class LoadingBar extends Component {
  constructor() {
    super();

    // Initial State
    this.state = {
      // To show
      show: true,

      // binding class when it end
      full: "",

      // state to animate the width of loading bar
      width: 0,

      // indicate the loading bar is in 100% ( so, wait it till gone )
      wait: false,

      // Error State
      myError: false
    };
  }

  render() {
    let { className, id } = this.props;
    let { show, full, myError } = this.state;

    return (
      <div>
        {show ? (
          <div
            id={id ? id : null}
            className={
              "LoadingBar " +
              (className ? className : "") +
              (myError ? "LoadingBar--error" : "") +
              (full ? "LoadingBar--full" : "")
            }
            style={this.styling()}
          >
            <div className="LoadingBar-glow" />
          </div>
        ) : null}
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    // Watching Progress Changes
    if (nextProps.progress !== this.props.progress) {
      this.setState({ width: nextProps.progress }, this.isFull.bind(this));
    }

    // Watching Error
    if (nextProps.error !== this.props.error) {
      if (nextProps.error)
        this.setState({ width: 100, myError: true }, this.isFull.bind(this));
    }
  }

  // Check whether the progress is full
  isFull() {
    // Full Indicator
    let isFull = this.state.width === 100;

    // When the progress end or full
    if (isFull) {
      // Prevent new progress change
      this.setState({ wait: true });

      // Start animate it
      setTimeout(() => {
        // animate when element removed
        this.setState({
          full: true,
          myError: false
        });

        this.props.onErrorDone();

        setTimeout(() => {
          this.setState({
            //remove bar element
            show: false,
            // New Element is available to create now
            width: 0,
            wait: false
          });

          setTimeout(() => {
            this.setState({
              // Show Bar
              full: "",
              show: true
            });

            this.props.onProgressDone();
          });

          // Duration to Waiting for slick hiding animation
        }, 250);

        // Duration is depend on css animation-duration of loading-bar
      }, 700);
    }
  }

  styling() {
    // When loading bar still in progress
    if (!this.state.wait) {
      return { width: `${this.state.width}%` };

      // When loading bar end
    } else {
      // Make it stuck at 100 to waiting the animation
      return { width: `100%` };
    }
  }
}

LoadingBar.defaultProps = {
  progress: 0,
  direction: "right",
  onErrorDone: () => {},
  onProgressDone: () => {}
};

export default LoadingBar;
