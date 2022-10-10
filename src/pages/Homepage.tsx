import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {fetchEstatesFromApi} from "../client/api/fetchEstates";
import {Container} from "react-bootstrap";
import {Estate} from "../model/estate/Estate";
import styled from "styled-components";
import {EstateResultsWrapper} from "../components/estateResultsWrapper/EstateResultsWrapper";

const ContentWrapper = styled.div`
    padding: 64px 0;
`

const ResultsOnPageWrapper = styled.div`
    text-align: right;
`

const ResultsOnPageSelect = styled.select`
    margin-left: 8px;
    width: 80px;
    padding: 4px 8px;
`

const HeaderWrapper = styled.div`
    padding-bottom: 16px;
    border-bottom: 2px solid #212529;
`

const Homepage = () => {
    const [estates, setEstates] = useState<Estate[]>([]);
    const [estatesTotalCount, setEstatesTotalCount] = useState<number | undefined>(undefined);
    const [resultsPerPage, setResultsPerPage] = useState<number>(10);
    const [isLoading, setIsLoading] = useState<boolean>(true);


    const onFetchEstates = useCallback(
        async (showResultsCount: number, offset: number = 0) => {
            const estatesResponse = await fetchEstatesFromApi(showResultsCount, offset);

            if (estatesResponse.type === "ERROR") {
                alert("Error occurs when trying to fetch estates. Try it again :(");
                setEstates([]);
                setEstatesTotalCount(undefined)
                setIsLoading(false);
                return;
            }

            if (offset === 0) {
                setEstates(estatesResponse.payload.estates);
            } else {
                setEstates((prevEstates) => [
                    ...prevEstates,
                    ...estatesResponse.payload.estates
                ])
            }

            setEstatesTotalCount(estatesResponse.payload.estatesCount);
        },
        []
    )

    const onLoadNextEstates = useCallback(
        async () => {
            console.log("NEXT");
            onFetchEstates(resultsPerPage, estates.length)
        },
        [resultsPerPage, estates]
    )

    useEffect(
        () => {
            const onFetch = async () => {
                setIsLoading(true);
                await onFetchEstates(resultsPerPage);
                setIsLoading(false);
            }

            onFetch();
        },
        [resultsPerPage],
    )

    return <Container>
        <ContentWrapper>
            <HeaderWrapper>
                <h1 className={"text-center"}>
                    Latest estates for sale
                    {estatesTotalCount && (` (${estatesTotalCount})`)}
                </h1>
                <ResultsOnPageWrapper>
                    <span>Show on page:</span>
                    <ResultsOnPageSelect
                        value={resultsPerPage}
                        onChange={(e) => setResultsPerPage(Number(e.target.value))}
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </ResultsOnPageSelect>
                </ResultsOnPageWrapper>
            </HeaderWrapper>
            <EstateResultsWrapper
                isLoading={isLoading}
                estates={estates}
                totalCount={estatesTotalCount}
                onLoadNextEstates={onLoadNextEstates}
            />
        </ContentWrapper>
    </Container>
};

export default Homepage;
