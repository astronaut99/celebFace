import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm =({onInputChange,onButtonSubmit})=> {
	return (
		<div className='ma4 mt0'>
			<p className='f3'>
				{'This Celebrity Face Recognition will figure out the name of the celebrity.'}
			</p>
			<p className='f3'>
				{'Paste the image link below.'}
			</p>
			<div className='center'>
				<div className='form center pa4 br3 shadow-5'>
					<input className='f4 pa2 w-70 center' type='text' onChange={onInputChange} onButtonSubmit={onButtonSubmit}/>
					<button className='w-30 grow f4 link ph3 pv2 dib white bg-dark-blue'
					onClick={onButtonSubmit}>Detect</button>
				</div>
			</div>
		</div>
	);
}

export default ImageLinkForm;