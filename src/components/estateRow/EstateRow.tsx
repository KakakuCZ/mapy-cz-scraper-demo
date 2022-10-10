import * as React from "react";
import {Estate} from "../../model/estate/Estate";
import {Carousel} from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styled from "styled-components";
import {Badge} from "react-bootstrap";
import {VIEWPORT_L, VIEWPORT_M, VIEWPORT_XL} from "../variables";

interface Props extends Estate {
}

const RowWrapper = styled.div`
    display: block;
    
    @media (min-width: ${VIEWPORT_L}) {
        display: flex;
    }
`

const CarouselWrapper = styled.div`
   max-width: 100%;
   
   @media (min-width: ${VIEWPORT_L}) {
        max-width: 750px;
   }
`

const InfoBox = styled.div`
   padding: 8px 0;
   
   @media (min-width: ${VIEWPORT_M}) {
        padding: 32px;
   }
   
   @media (min-width: ${VIEWPORT_L}) {
        padding: 160px 16px;
   }
   
   @media (min-width: ${VIEWPORT_XL}) {
        padding: 160px 32px;
   }
`

const InfoRow = styled.p`
    font-size: 18px;
    line-height: 24px;
`

const BadgeWrapper = styled.div`
    margin: 16px 0;
`

export const EstateRow: React.FunctionComponent<Props> = (props) => {
    return <RowWrapper key={props.id}>
        {props.images && props.images.length > 1 && (
            <CarouselWrapper>
                <Carousel>
                    {props.images?.map((image, i) => (
                        <div key={i}>
                            <img src={image.url} />
                        </div>
                    ))}
                </Carousel>
            </CarouselWrapper>
        )}

        <InfoBox>
            <h2>
                {props.title}
            </h2>

            {props.labels.length > 0 && (
                <BadgeWrapper>
                    {props.labels.map((label, i) => {
                        return <Badge key={i}>
                            {label.text}
                        </Badge>
                    })}
                </BadgeWrapper>
            )}

            <InfoRow>Locality: {props.locality}</InfoRow>
            <InfoRow>
                Price:{" "}
                <strong>
                    {props.price
                        ? (props.price.toLocaleString(
                            'cs',
                            {
                                style: "currency",
                                currency: "CZK",
                                maximumFractionDigits: 0
                            }
                        ))
                        : "Ask your real estate agency"
                    }
                </strong>
            </InfoRow>
        </InfoBox>
    </RowWrapper>
}
