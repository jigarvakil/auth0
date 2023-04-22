import React, { useState } from "react";
import { Button,Container, Row  } from "reactstrap";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import Highlight from "../components/Highlight";
import { getConfig } from "../config";
import Loading from "../components/Loading";
import axios from "axios";
import { } from "reactstrap";

export const ExternalApiComponent = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const { apiOrigin = "http://localhost:4000" } = getConfig();

  const [state, setState] = useState({
    showResult: false,
    apiMessage: "",
    error: null,
    token: null
  });

  const callApi = () => {
    axios.get(`${apiOrigin}`).then(res=>console.log(res?.data?.msg))  
  }

  const callProtectedApi = async () => {
   try {
    const token = await getAccessTokenSilently()
    const response = await axios.get(`${apiOrigin}/protected`,{
      headers:{
        authorization: `Bearer ${token}`
      }
    })
    console.log(response,"res");
   } catch (error) {
    console.log(error.message);
   }
  }

  return (
    <>
      <div>
        <Button onClick={callApi}>Call API</Button>
        <br/>
        <br/>
        <Button onClick={callProtectedApi}>Call Protected API</Button>
      </div>
      <Container className="mb-5 mt-5">
      <Row>
        <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
      </Row>
    </Container>
    </>
  );
};

export default withAuthenticationRequired(ExternalApiComponent, {
  onRedirecting: () => <Loading />,
});
