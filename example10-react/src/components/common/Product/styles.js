import styled, { css } from 'styled-components'

export const

    Header = styled.div`
        padding: 16px 16px 0;
        color: #fff;
        font-size: 16px;
        font-weight: 500;
        line-height: 1;
        height: 1.5em;
    `,

    Body = styled.div`
        figure {
            padding: 8px 18px;
            margin: 0 auto;
            display: block;
        }
    `,

    Footer = styled.footer`
        padding: 0 16px 16px;
    `,

    Title = styled.div`
        line-height: 1.25;
        font-size: 12px;
        text-decoration: none;
        color: #fff;
        font-weight: 500;
        height: 2.4rem;
    `,
    Category = styled.div`
        color: rgb(235, 75, 75);
        line-height: 1.5;
        font-size: 12px;
        text-decoration: none;
        text-transform: uppercase;
        font-weight: 700;
    `,

    ProductCard = styled.article`
        position: relative;

        height: 100%;
        overflow: hidden;
        box-sizing: border-box;

        border-radius: 4px;
        border-bottom: 2px solid transparent;

        background-color: #121821;

        ${props => {
            switch (props.type) {
                case 'set':
                    return css`
                        border-color: rgb(235, 75, 75);
                        background-image: radial-gradient(circle at 50% 100%, rgba(235, 75, 75, 0.2), transparent 60%);
                        ${Category} { color: rgb(235, 75, 75); }
                    `
                case 'command':
                    return css`
                        border-color: rgb(211, 44, 230);
                        background-image: radial-gradient(circle at 50% 100%, rgba(211, 44, 230, 0.2), transparent 60%);
                        ${Category} { color: rgb(211, 44, 230); }
                    `
                default:
                    return css`
                        border-color: #b0c3d9;
                        background-image: radial-gradient(circle at 50% 100%, rgba(176, 195, 217, 0.2), transparent 60%);
                        ${Category} { color: rgb(176, 195, 217); }
                    `
            }
        }}

        transition: background-color 0.2s ease-in-out;

        &:hover {
            cursor: pointer;
            background-color: hsl(217.5deg 28.57% 12%);
        }
    `
