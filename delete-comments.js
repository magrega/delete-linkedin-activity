//https://www.linkedin.com/in/{username}/recent-activity/comments/

/**
 * Halts execution for a certain amount of seconds.
 * https://stackoverflow.com/a/39914235
 * 
 */


let keepGoing = true;

const sleep = seconds => new Promise(resolve => setTimeout(resolve, seconds * 1000));

// Gets "Delete" button inside "Are you sure you want to delete your comment?" confirmation box.
const getDeleteConfirmationButton = () => document.querySelector("button.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view");

// Clicks confirmation button in delete modal window
const deleteComment = async () => {
    await sleep(2);
    const deleteConfirmationButton = getDeleteConfirmationButton();
    if (deleteConfirmationButton) {
        deleteConfirmationButton.click();
    } else {
        console.log("error getting confirm button");
    }
}

// Deletes comment
const deleteActivity = async (comment) => {
    comment.closest('.comments-post-meta').parentElement.lastElementChild.querySelector('button').click();
    console.log('clicked dropdown button');
    await sleep(2);
    comment.closest('.comments-post-meta').parentElement.lastElementChild.querySelector('button').nextElementSibling.querySelectorAll('.single-line')[2].firstElementChild.click();
    console.log('clicked delete button');
    deleteComment();
    await sleep(3);
    console.log('deleted comment');
}

// Makes cycle wait until iteration finishes
const makeLoopAwait = (comment) => {
    return new Promise(resolve => {
        setTimeout(() =>
            resolve(deleteActivity(comment)), 5000);
    })
}

// Starts the whole thing
const init = async () => {
    console.log("*** Starting activity deletion ***");

    const allComments = document.getElementsByClassName("comments-post-meta__name-text");

    for (let i = 0; i < allComments.length; i++) {
        if (allComments[i].textContent.includes(commentAuthor) && allComments[i].closest('.comments-comment-item__post-meta')) {
            console.log('Deleting base comment');
            console.log(allComments[i]);
            await makeLoopAwait(allComments[i]);
        }
    }

    for (let i = 0; i < allComments.length; i++) {
        if (allComments[i].textContent.includes(commentAuthor) && allComments[i].closest('.comments-reply-item__post-meta')) {
            console.log('Deleting reply comment');
            console.log(allComments[i]);
            await makeLoopAwait(allComments[i]);
        }
    }

    window.scrollTo(0, document.body.scrollHeight);

    console.log('ended init() iteration, scrolling down');
    if (keepGoing) {
        await sleep(4);
        init();
    }
}

const commentAuthor = document.querySelector('.single-line-truncate').innerText;
init();
