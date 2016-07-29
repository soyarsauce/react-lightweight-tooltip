import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';

export default class Tooltip extends React.Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    content: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
    ]),
    styles: PropTypes.object,
  }

  styles = {
    wrapper: {
      position: 'relative',
      zIndex: '98',
      color: '#555',
      cursor: 'help',
    },
    tooltip: {
      position: 'absolute',
      display: 'inline-block',
      zIndex: '99',
      bottom: '100%',
      left: '50%',
      WebkitTransform: 'translateX(-50%)',
      msTransform: 'translateX(-50%)',
      OTransform: 'translateX(-50%)',
      transform: 'translateX(-50%)',
      marginBottom: '10px',
      padding: '5px',
      width: '100%',
      background: '#000',
    },
    content: {
      background: '#000',
      padding: '.3em 1em',
      color: '#fff',
      whiteSpace: 'normal',
      overflow: 'auto',
    },
    arrow: {
      borderLeft: 'solid transparent 5px',
      borderRight: 'solid transparent 5px',
      borderTop: 'solid #000 5px',
      bottom: '-5px',
      height: '0',
      left: '50%',
      marginLeft: '-5px',
      position: 'absolute',
      width: '0',
    },
    gap: {
      bottom: '-20px',
      display: 'block',
      height: '20px',
      left: '0',
      position: 'absolute',
      width: '100%',
    },
  }

  constructor(props) {
    super(props);
    this.state = {
      id: Math.random().toString(36),
      visible: false,
    };
    if (props.styles) this.mergeStyles(props.styles);
  }

  mergeStyles = (userStyles) => {
    Object.keys(this.styles).forEach((name) => {
      Object.assign(this.styles[name], userStyles[name]);
    });
  }

  show = () => this.setVisibility(true);

  hide = () => this.setVisibility(false);

  setVisibility = (visible) => {
    this.setState(Object.assign({}, this.state, {
      visible,
    }));
  }

  handleTouch = () => {
    this.show();
    this.assignOutsideTouchHandler();
  }

  assignOutsideTouchHandler = () => {
    const handler = (e) => {
      let currentNode = e.target;
      const componentNode = ReactDOM.findDOMNode(this.refs.instance);
      while (currentNode.parentNode) {
        if (currentNode === componentNode) return;
        currentNode = currentNode.parentNode;
      }
      if (currentNode !== document) return;
      this.hide();
      document.removeEventListener('click', handler);
    }
    document.addEventListener('click', handler);
  }

  render() {
    const {props, state, styles, show, hide, handleTouch} = this;
    return (
      <div
        onMouseEnter={show}
        onMouseLeave={hide}
        onTouchStart={handleTouch}
        style={styles.wrapper}>
        {props.children}
        {
          state.visible &&
          <div style={styles.tooltip}>
            <div style={styles.content}>{props.content}</div>
            <div style={styles.arrow}> </div>
            <div style={styles.gap}> </div>
          </div>
        }
      </div>
    )
  }
}