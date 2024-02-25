import { Row } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';

function LoadingButton() {
    return (
        <Row className="justify-content-center">
            <Spinner animation="grow" variant="success" className="justify-content-center">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </Row>
    );
}

export default LoadingButton;