import React, { Component } from 'react';

interface PropsValue {
    title?: string;
    style?: React.CSSProperties;
    onclick?: () => void;
}

class FunctionModule extends Component<PropsValue> {
    static defaultProps = {
        title: '敬请期待',
        style: {},
        onclick: () => {alert("敬请期待")},
    };

    constructor(props: PropsValue) {
        super(props);
    }

    render() {
        const { title, style,onclick } = this.props;

        return <div style={style} onClick={onclick}>{title}</div>;
    }
}

export default FunctionModule;