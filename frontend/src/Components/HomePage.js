import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import GithubIcon from 'remixicon-react/GithubFillIcon'
import LinkIcon from 'remixicon-react/LinkIcon'
import CopyIcon from 'remixicon-react/FileCopyFillIcon'
import DropDownIcon from 'remixicon-react/ArrowDropDownLineIcon'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function HomePage() {
    const [Linkshrt, setLinkshrt] = useState("");
    const [urlFromButtonClick, setUrlFromButtonClick] = useState("");
    const [buttonClicked, setButtonClicked] = useState(false);
    const [fetchLoader, setFetchLoader] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(null)
    const [shortenedLinks, setShortenedLinks] = useState(() => {
        let storedShortLinks = localStorage.getItem('miniURLShortenedLinks');
        return storedShortLinks ? JSON.parse(storedShortLinks) : [];
    });
    const [originalLinks, setOriginalLinks] = useState(() => {
        let storedOriginalLinks = localStorage.getItem('miniURLOriginalLinks');
        return storedOriginalLinks ? JSON.parse(storedOriginalLinks) : [];
    })

    useEffect(() => {
        localStorage.setItem('miniURLOriginalLinks', JSON.stringify(originalLinks));
        localStorage.setItem('miniURLShortenedLinks', JSON.stringify(shortenedLinks))
    }, [originalLinks, shortenedLinks])

    // A function to validate the urls
    function handleSubmit(e) {
        e.preventDefault();
        let LinkshrtTrimmed = Linkshrt.trim();
        let urlRegex = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;
        if (!urlRegex.test(Linkshrt)) {
            toast.error('Please input a valid url', {
                theme: 'colored',
            })
            return;
        } else {
            setUrlFromButtonClick(LinkshrtTrimmed);
            setButtonClicked(true);
            setLinkshrt("");
        }
    }

    useEffect(() => {
        if (buttonClicked && urlFromButtonClick) {
            fetchData();
            setButtonClicked(false)
        }
        // eslint-disable-next-line
    }, [urlFromButtonClick, buttonClicked,]);

    const fetchData = async () => {
        //LINK TO BE SHORTENED MUST BE NAMED url
        let url = urlFromButtonClick;
        try {
            setFetchLoader(true)
            fetch(`https://miniurl-api-alfz.onrender.com/shorten`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url })
            })
                .then(res => { return res.json() })
                .then(data => {
                    setFetchLoader(false)
                    console.log(data)
                    if (data.shortUrl) {
                        toast.success('Link shortened successfully', {
                            theme: 'colored',
                        });
                        setOriginalLinks([urlFromButtonClick, ...originalLinks]);
                        setShortenedLinks([data.shortUrl, ...shortenedLinks])
                    } else {
                        toast.error('Internal server error', {
                            theme: 'colored',
                        })
                    }
                }).catch((err) => {
                    toast.error('Couldn\'t connect server', {
                        theme: 'colored',
                    })
                    console.log("Couldn't connect server")
                }).finally(() => {
                    setFetchLoader(false)
                })
        } catch (err) {
            toast.error('An error occured', {
                theme: 'colored',
            })
            console.log("Couldn't connect server")
        }
    }
    function copyLinkFnc(link, index) {
        const copyToClipboard = text => navigator.clipboard
            ?.writeText && navigator.clipboard.writeText(text);

        copyToClipboard(shortenedLinks[index]).then(() => {
            toast.success('Link copied successfully', {
                theme: 'colored'
            })
        })
    }
    function LinkTable() {
        return (
            <div className='desktop-table'>
                <table className='link-table'>
                    <thead>
                        <th>Short Links</th>
                        <th>Original Links</th>
                    </thead>
                </table>
                {originalLinks.map((link, ind) => (
                    <div className='links-table-div'>

                        <div className='short-link-div-desktop'>
                            <p>{shortenedLinks[ind]}</p>
                            <button className='copy-btn' onClick={() => copyLinkFnc(link, ind)}><CopyIcon className='copy-icon' /></button>
                        </div>
                        <div className='long-link-div-desktop'>
                            <p>{link}</p>
                        </div>
                    </div>
                ))}
            </div>
        )
    }
    function LinkTableMobile() {
        function handleDetails(ind) {
            setIsDropdownOpen(ind)
        }
        return (
            <div className='mobile-table'>
                <table className='link-table-mobile'>
                    <thead>
                        <th>Short Links</th>
                    </thead>
                </table>
                {originalLinks.map((link, ind) => (
                    <div key={ind}>
                        <div className='links-table-div'>
                            <div className='short-links-table'>
                                <div className='short-links-div'>
                                    <p>{shortenedLinks[ind]} </p>
                                    <button className='copy-btn' onClick={() => copyLinkFnc(link, ind)}><CopyIcon className='copy-icon' /></button>
                                </div>
                                <button className='copy-btn' onClick={() => handleDetails(ind)}><DropDownIcon className='drop-down-icon' /></button>
                            </div>
                            {isDropdownOpen === ind &&
                                <div className='long-link-div'>
                                    <p>{link}</p>
                                </div>
                            }
                        </div>
                    </div>
                ))}


            </div>
        )
    }
    return (
        <div>
            <header className='header'>
                <Link to='/' className='Logo-class'>miniURL</Link>
                <a href='https://github.com/DOOMSDAY101/miniurl-API' target='_blank' rel="noreferrer" className='view-github'><GithubIcon className='gh-link' /> API documentation</a>
            </header>
            <main>
                <div className='text-div'>
                    <h1 className='text-div-text'>Shorten Your Loooong Links</h1>
                    <h1 className='text-sub-text'>miniURL is an efficient and easy-to-use URL shortening service that streamlines your online experience.</h1>
                    <form onSubmit={handleSubmit}>
                        <label> <LinkIcon className='link-icon' />
                            <input type='text' autoComplete='off' value={Linkshrt} onChange={(e) => setLinkshrt(e.target.value)} className='input-link' placeholder='Enter link here...' required autoFocus />
                            <button type='submit' className='submit-btn' disabled={fetchLoader}></button>
                        </label>
                    </form>
                </div>
                <div style={{ "overflowX": "auto", padding: "0 10px 0 10px" }} className='table-div'>
                    {shortenedLinks.length !== 0 &&
                        <>
                            <LinkTable />
                            <LinkTableMobile />
                        </>
                    }
                </div>
            </main >
        </div >
    )
}

export default HomePage
