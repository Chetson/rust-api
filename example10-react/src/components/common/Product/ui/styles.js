import styled from 'styled-components'

export const
    Price = styled.div``,
    ProductPrice = styled.div`
        flex-grow: 1;
        font-family: 'Share Tech Mono', monospace;
        letter-spacing: -1px;

        s {
            color: rgb(255 255 255 / 50%);
        }
    `,
    Amount = styled.div`
        color: rgb(255 255 255 / 50%);
        font-weight: 400;
        line-height: 1;
        height: 1.5em;
        font-size: 12px;
        margin-top: 4px;
        position: relative;
        backdrop-filter: blur(3px);
        display: inline-block;
        padding: 2px 4px;
        border-radius: 2px;
        left: -2px;
        top: -1px;
    `
