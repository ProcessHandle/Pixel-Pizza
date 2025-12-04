function expandOrderHistory(item)
{
    let orderDetails = item.parentElement.parentElement.getElementsByClassName('order-details')[0]

    if(orderDetails.classList.contains('collapsed'))
    {
        orderDetails.classList.remove('collapsed')
        item.innerText = "Hide Details"
    }
    else
    {
        orderDetails.classList.add('collapsed')
        item.innerText = "Show Details"
    }
}