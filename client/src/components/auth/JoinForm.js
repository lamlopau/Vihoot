import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const JoinForm = () => {
	

	return (
		<div className='landing'>
			<div className='dark-overlay'>
				<div className='landing-inner'>
					<h1>Vihoot</h1>
					<h4>Keep track of what you are learning</h4>
					<Form className='my-4' >
				

				<Form.Group>
					<Form.Control
						type='text'
						placeholder='Name'
						name='name'
						required
						
					/>
				</Form.Group>
				<Form.Group>
					<Form.Control
						type='number'
						placeholder='PIN CODE'
						name='pin'
						required
						
					/>
				</Form.Group>
				<Button variant='success' type='submit'>
					Join
				</Button>
                
			</Form>
            <Button href = '/login' variant='primary' type='submit'>
				Host
				</Button>
				</div>
			</div>
		</div>
	)
}

export default JoinForm
