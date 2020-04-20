const pic_lst = [
    'https://waffle-content.s3.amazonaws.com/lovers-skill/happy-anniversary-APL-couple1.jpg', 'https://waffle-content.s3.amazonaws.com/lovers-skill/happy-anniversary-APL-couple2.jpg','https://waffle-content.s3.amazonaws.com/lovers-skill/happy-anniversary-APL-couple3.jpg','https://waffle-content.s3.amazonaws.com/lovers-skill/happy-anniversary-APL-couple4.jpg'
];

module.exports = {
    sayAnnivDateDS(month, day, isAnniv) {
        let datasource = {
            "bodyTemplate6Data": {
                "type": "object",
                "objectId": "bt6Sample",
                "backgroundImage": {
                    "contentDescription": null,
                    "smallSourceUrl": null,
                    "largeSourceUrl": null,
                    "sources": [
                        {
                            "url": "https://waffle-content.s3.amazonaws.com/lovers-skill/happy-anniversary-APL-bg1.png",
                            "size": "small",
                            "widthPixels": 0,
                            "heightPixels": 0
                        },
                        {
                            "url": "https://waffle-content.s3.amazonaws.com/lovers-skill/happy-anniversary-APL-bg1.png",
                            "size": "large",
                            "widthPixels": 0,
                            "heightPixels": 0
                        }
                    ]
                },
                "textContent": {
                    "primaryText": {
                        "type": "PlainText",
                        "text": "Your Anniversary is on:",
                        "aniv": `${month} ${day}`
                    }
                },
                "logoUrl": "https://d2o906d8ln7ui1.cloudfront.net/images/cheeseskillicon.png",
                "hintText": "Try, \"Alexa, tell me a Fun Fact\""
            }
        }
        if (isAnniv) {
            datasource = {
                "bodyTemplate6Data": {
                    "type": "object",
                    "objectId": "bt6Sample",
                    "backgroundImage": {
                        "contentDescription": null,
                        "smallSourceUrl": null,
                        "largeSourceUrl": null,
                        "sources": [
                            {
                                "url": "https://waffle-content.s3.amazonaws.com/lovers-skill/happy-anniversary-APL-bg2.png",
                                "size": "small",
                                "widthPixels": 0,
                                "heightPixels": 0
                            },
                            {
                                "url": "https://waffle-content.s3.amazonaws.com/lovers-skill/happy-anniversary-APL-bg2.png",
                                "size": "large",
                                "widthPixels": 0,
                                "heightPixels": 0
                            }
                        ]
                    },
                    "textContent": {
                        "primaryText": {
                            "type": "PlainText",
                            "text": "Your Anniversary is:",
                            "aniv": `Today! Congratulations!`
                        }
                    },
                    "logoUrl": "https://d2o906d8ln7ui1.cloudfront.net/images/cheeseskillicon.png",
                    "hintText": "Try, \"Alexa, tell me a Fun Fact\""
                }
            }
        } 
        return datasource;
    },
    funFactDS(factIntro, fact) {
        let datasource = {
            "bodyTemplate1Data": {
                "type": "object",
                "objectId": "bt1Sample",
                "backgroundImage": {
                    "contentDescription": null,
                    "smallSourceUrl": null,
                    "largeSourceUrl": null,
                    "sources": [
                        {
                            "url": "https://waffle-content.s3.amazonaws.com/lovers-skill/happy-anniversary-APL-bg5.png",
                            "size": "small",
                            "widthPixels": 0,
                            "heightPixels": 0
                        },
                        {
                            "url": "https://waffle-content.s3.amazonaws.com/lovers-skill/happy-anniversary-APL-bg5.png",
                            "size": "large",
                            "widthPixels": 0,
                            "heightPixels": 0
                        }
                    ]
                },
                "title": `${factIntro}`,
                "textContent": {
                    "primaryText": {
                        "type": "PlainText",
                        "text": `${fact}`
                    }
                },
                "logoUrl": "https://d2o906d8ln7ui1.cloudfront.net/images/cheeseskillicon.png"
            }
        }
        return datasource
    },
    showPicture(header) {
        let datasource = {
            "bodyTemplate7Data": {
                "type": "object",
                "objectId": "bt7Sample",
                "title": `${header}`,
                "backgroundImage": {
                    "contentDescription": null,
                    "smallSourceUrl": null,
                    "largeSourceUrl": null,
                    "sources": [
                        {
                            "url": "https://waffle-content.s3.amazonaws.com/lovers-skill/happy-anniversary-APL-bg4.png",
                            "size": "small",
                            "widthPixels": 0,
                            "heightPixels": 0
                        },
                        {
                            "url": "https://waffle-content.s3.amazonaws.com/lovers-skill/happy-anniversary-APL-bg4.png",
                            "size": "large",
                            "widthPixels": 0,
                            "heightPixels": 0
                        }
                    ]
                },
                "image": {
                    "contentDescription": null,
                    "smallSourceUrl": null,
                    "largeSourceUrl": null,
                    "sources": [
                        {
                            "url": "https://waffle-content.s3.amazonaws.com/lovers-skill/happy-anniversary-APL-couple1.jpg",
                            "size": "small",
                            "widthPixels": 0,
                            "heightPixels": 0
                        },
                        {
                            "url": "https://waffle-content.s3.amazonaws.com/lovers-skill/happy-anniversary-APL-couple1.jpg",
                            "size": "large",
                            "widthPixels": 0,
                            "heightPixels": 0
                        }
                    ]
                },
                "logoUrl": "https://d2o906d8ln7ui1.cloudfront.net/images/cheeseskillicon.png",
                "hintText": "Try, \"Alexa, Tell me a Fun Fact\""
            }
        }
        return datasource
    }
}