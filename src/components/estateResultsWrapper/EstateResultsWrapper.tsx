import {Row, Spinner} from "react-bootstrap";
import * as React from "react";
import styled from "styled-components";
import {EstateRow} from "../estateRow/EstateRow";
import {Estate} from "../../model/estate/Estate";
import {useEffect, useMemo, useRef} from "react";

const SpinnerWrapper = styled.div`
    text-align: center;
    margin: 32px 0;
`;

const EstatesWrapper = styled.div`
    padding-top: 32px;
`;

const NoResultsWrapper = styled.div`
    padding: 8px;
    text-align: center;
`

interface Props {
    isLoading: boolean;
    estates: Estate[];
    totalCount: number | undefined;
    onLoadNextEstates: () => void;
}

export const EstateResultsWrapper: React.FunctionComponent<Props> = (props) => {
    const infinityScrollHolderRef = useRef<HTMLDivElement | null>(null);
    const intersectionObserverRef = useRef<IntersectionObserver | undefined>(undefined);

    const isPaginationAvailable = useMemo(
        (): boolean => {
            return (props.totalCount ?? 0) > props.estates.length;
        },
        [props.estates.length, props.totalCount]
    )

    useEffect(
        () => {
            intersectionObserverRef.current = new IntersectionObserver(
                (entries) => {
                    entries.forEach(({isIntersecting, intersectionRatio}) => {
                        if (intersectionObserverRef.current && (isIntersecting || intersectionRatio > 0)) {
                            intersectionObserverRef.current?.disconnect();
                            props.onLoadNextEstates();
                        }
                    });
                }, {
                    rootMargin: "100% 0%",
                }
            );

            infinityScrollHolderRef.current && intersectionObserverRef.current.observe(infinityScrollHolderRef.current);
        },
        [props.estates.length]
    )

    if (props.isLoading) {
        return <SpinnerWrapper>
            <Spinner animation={"border"}/>
        </SpinnerWrapper>
    }

    if (!props.estates || props.estates.length === 0 || props.totalCount === undefined) {
        return <NoResultsWrapper>
            No results.
        </NoResultsWrapper>
    }

    return <EstatesWrapper>
        {props.estates.map((estate) => {
            return <React.Fragment key={estate.hash}>
                <Row key={estate.id}>
                    <EstateRow
                        id={estate.id}
                        title={estate.title}
                        price={estate.price}
                        hash={estate.hash}
                        locality={estate.locality}
                        images={estate.images}
                        labels={estate.labels}
                    />
                </Row>
                <hr />
            </React.Fragment>;
        })}
        {isPaginationAvailable && (
            <div ref={infinityScrollHolderRef}>
                <SpinnerWrapper>
                    <Spinner animation={"border"}/>
                </SpinnerWrapper>
            </div>
        )}
    </EstatesWrapper>;
}
