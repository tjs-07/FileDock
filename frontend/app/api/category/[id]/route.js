const deleteCategory = async (id) => {

    try {

        await axios.delete(
            `${process.env.NEXT_PUBLIC_API_URL}/category/${id}`
        );

        await getCategories();

    } catch (error) {

        console.log(error);

    }

};